from __future__ import annotations

import json
import io
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

from scripts.update_scholar import (
    DEFAULT_SCHOLAR_ID,
    ScholarUpdateError,
    hydrate_new_publications,
    main,
    normalize_publications,
    update_publication_file,
)


ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "tests" / "fixtures" / "scholar-profile.json"


class ScholarSyncTests(unittest.TestCase):
    TEST_SCHOLAR_ID = "haibiao-test-id"

    def test_default_scholar_id_is_empty(self) -> None:
        self.assertEqual("", DEFAULT_SCHOLAR_ID)

    def test_network_update_without_id_skips_and_preserves_manual_cache(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "publications.json"
            original = json.dumps(
                {
                    "scholarId": "",
                    "source": "manual",
                    "publications": [
                        {
                            "title": "Manual Work",
                            "authors": "Haibiao Zhang",
                            "venue": "Manual Venue",
                            "year": 2025,
                            "url": "https://example.org/manual",
                            "citations": None,
                        }
                    ],
                }
            )
            output.write_text(original, encoding="utf-8")
            stdout = io.StringIO()
            with patch("scripts.update_scholar.load_live_scholar") as load_live:
                with redirect_stdout(stdout):
                    result = main(["--output", str(output)])

            self.assertEqual(0, result)
            load_live.assert_not_called()
            self.assertIn("skipped", stdout.getvalue().lower())
            self.assertEqual(original, output.read_text(encoding="utf-8"))

    def test_only_new_scholar_summaries_request_detail_pages(self) -> None:
        summaries = [
            {
                "bib": {"title": "Existing Work", "pub_year": "2025"},
                "num_citations": 8,
            },
            {
                "bib": {"title": "New Work", "pub_year": "2026"},
                "num_citations": 0,
            },
        ]
        existing = [
            {
                "title": "Existing Work",
                "authors": "Haibiao Zhang",
                "venue": "Existing Venue",
                "year": 2025,
                "url": "https://example.org/existing",
                "citations": 7,
            }
        ]
        detail_requests: list[str] = []

        def fill_detail(summary: dict) -> dict:
            detail_requests.append(summary["bib"]["title"])
            return {
                **summary,
                "bib": {
                    **summary["bib"],
                    "author": "Haibiao Zhang and Test Collaborator",
                    "citation": "New Conference, 2026",
                },
                "pub_url": "https://example.org/new",
            }

        hydrated = hydrate_new_publications(summaries, existing, fill_detail)
        normalized = normalize_publications(hydrated, existing)

        self.assertEqual(["New Work"], detail_requests)
        existing_work = next(item for item in normalized if item["title"] == "Existing Work")
        self.assertEqual("Haibiao Zhang", existing_work["authors"])
        self.assertEqual("https://example.org/existing", existing_work["url"])
        self.assertEqual(8, existing_work["citations"])

    def test_all_scholar_works_are_normalized_with_publication_metadata(self) -> None:
        publications = normalize_publications(
            [
                {
                    "bib": {
                        "title": "Two-branch Network with Feature Fusion for Time Since Deposition Estimation of Bloodstains",
                        "author": "Lin Shi and Yushi Li and Yu Han and Test Collaborator and Fangyu Wu and Chenke Yin and Haibiao Zhang",
                        "pub_year": "2024",
                        "citation": "2024 27th International Conference on Computer Supported Cooperative Work in Design (CSCWD), 2191-2196",
                    },
                    "pub_url": "https://doi.org/10.1109/CSCWD61410.2024.10580800",
                    "eprint_url": "https://example.org/bloodstain-author-copy.pdf",
                    "num_citations": 3,
                },
                {
                    "bib": {
                        "title": "A Visible Scholar Work",
                        "author": "Haibiao Zhang",
                        "pub_year": "2025",
                    }
                },
            ]
        )

        self.assertEqual(
            [
                "A Visible Scholar Work",
                "Two-branch Network with Feature Fusion for Time Since Deposition Estimation of Bloodstains",
            ],
            [item["title"] for item in publications],
        )
        bloodstain = publications[1]
        self.assertEqual(2024, bloodstain["year"])
        self.assertEqual(3, bloodstain["citations"])
        self.assertIn("CSCWD", bloodstain["venue"])
        self.assertEqual(
            "https://doi.org/10.1109/CSCWD61410.2024.10580800",
            bloodstain["url"],
        )
        self.assertEqual(
            "https://example.org/bloodstain-author-copy.pdf",
            bloodstain["pdfUrl"],
        )

    def test_truncated_venue_preserves_existing_complete_metadata(self) -> None:
        previous = {
            "title": "A Scholar Work",
            "authors": "Haibiao Zhang",
            "venue": "Complete Conference Name (CCN), 1–10, 2025",
            "year": 2025,
            "url": "https://example.org/work",
            "citations": 2,
        }

        for truncated in ("Complete Conference Name …, 2025", "Complete Conference Name ..., 2025"):
            with self.subTest(truncated=truncated):
                publications = normalize_publications(
                    [
                        {
                            "bib": {
                                "title": "A Scholar Work",
                                "author": "Haibiao Zhang",
                                "pub_year": "2025",
                                "citation": truncated,
                            }
                        }
                    ],
                    [previous],
                )

                self.assertEqual(previous["venue"], publications[0]["venue"])

    def test_fixture_normalizes_deterministically_and_preserves_curated_url(self) -> None:
        raw = json.loads(FIXTURE.read_text(encoding="utf-8"))["publications"]
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "publications.json"
            output.write_text(
                json.dumps(
                    {
                        "scholarId": "haibiao-test-id",
                        "updatedAt": "2025-01-01T00:00:00Z",
                        "source": "seed",
                        "publications": [
                            {
                                "title": "A Newer Scholar Work",
                                "authors": "Haibiao Zhang, Test Collaborator",
                                "venue": "Example Conference",
                                "year": 2026,
                                "url": "https://example.org/curated",
                                "citations": 1,
                            },
                            {
                                "title": "An Earlier Scholar Work",
                                "authors": "Test Collaborator and Haibiao Zhang",
                                "venue": "Example Journal",
                                "year": 2024,
                                "url": "https://example.org/earlier",
                                "citations": 10,
                            },
                        ],
                    }
                ),
                encoding="utf-8",
            )

            changed = update_publication_file(
                output,
                self.TEST_SCHOLAR_ID,
                raw,
                "fixture",
                "2026-08-07T00:00:00Z",
            )
            data = json.loads(output.read_text(encoding="utf-8"))

            self.assertTrue(changed)
            self.assertEqual([2026, 2024], [item["year"] for item in data["publications"]])
            self.assertEqual("https://example.org/newer", data["publications"][0]["url"])
            self.assertEqual("https://example.org/earlier", data["publications"][1]["url"])
            self.assertEqual(11, data["publications"][1]["citations"])

    def test_invalid_empty_result_keeps_last_valid_file_untouched(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "publications.json"
            original = '{"scholarId":"haibiao-test-id","publications":[]}\n'
            output.write_text(original, encoding="utf-8")

            with self.assertRaises(ScholarUpdateError):
                update_publication_file(output, self.TEST_SCHOLAR_ID, [], "fixture")

            self.assertEqual(original, output.read_text(encoding="utf-8"))

    def test_suspiciously_truncated_result_keeps_existing_data(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "publications.json"
            existing = {
                "scholarId": "haibiao-test-id",
                "publications": [
                    {
                        "title": f"Existing Work {index}",
                        "authors": "Haibiao Zhang",
                        "venue": "Venue",
                        "year": 2024,
                        "url": "",
                        "citations": 0,
                    }
                    for index in range(10)
                ],
            }
            original = json.dumps(existing)
            output.write_text(original, encoding="utf-8")
            raw = [
                {
                    "bib": {
                        "title": "Only One Work",
                        "author": "Haibiao Zhang",
                        "pub_year": "2026",
                    }
                }
            ]

            with self.assertRaises(ScholarUpdateError):
                update_publication_file(output, self.TEST_SCHOLAR_ID, raw, "fixture")

            self.assertEqual(original, output.read_text(encoding="utf-8"))

    def test_any_count_decrease_is_rejected_by_default(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "publications.json"
            existing = {
                "scholarId": "haibiao-test-id",
                "publications": [
                    {
                        "title": f"Existing Work {index}",
                        "authors": "Haibiao Zhang",
                        "venue": "Venue",
                        "year": 2024,
                        "url": "",
                        "citations": 0,
                    }
                    for index in range(6)
                ],
            }
            original = json.dumps(existing)
            output.write_text(original, encoding="utf-8")
            raw = [
                {
                    "bib": {
                        "title": f"Existing Work {index}",
                        "author": "Haibiao Zhang",
                        "pub_year": "2024",
                    }
                }
                for index in range(3)
            ]

            with self.assertRaises(ScholarUpdateError):
                update_publication_file(output, self.TEST_SCHOLAR_ID, raw, "fixture")

            self.assertEqual(original, output.read_text(encoding="utf-8"))

    def test_count_decrease_requires_explicit_removal_override(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "publications.json"
            existing = {
                "scholarId": "haibiao-test-id",
                "publications": [
                    {
                        "title": f"Existing Work {index}",
                        "authors": "Haibiao Zhang",
                        "venue": "Venue",
                        "year": 2024,
                        "url": "",
                        "citations": 0,
                    }
                    for index in range(6)
                ],
            }
            output.write_text(json.dumps(existing), encoding="utf-8")
            raw = [
                {
                    "bib": {
                        "title": f"Existing Work {index}",
                        "author": "Haibiao Zhang",
                        "pub_year": "2024",
                    }
                }
                for index in range(3)
            ]

            changed = update_publication_file(
                output,
                self.TEST_SCHOLAR_ID,
                raw,
                "fixture",
                allow_removals=True,
            )

            self.assertTrue(changed)
            data = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(3, len(data["publications"]))


if __name__ == "__main__":
    unittest.main()
