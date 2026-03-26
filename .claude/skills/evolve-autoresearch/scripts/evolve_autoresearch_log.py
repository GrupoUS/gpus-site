#!/usr/bin/env python3
"""
Karpathy autoresearch-style experiment log for EVOLVE_AUTORESEARCH.

Mirrors the discipline of results.tsv in github.com/karpathy/autoresearch:
tab-separated rows, append-only history, keep/discard semantics.

Uses only the Python standard library.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

TSV_NAME = "experiments.tsv"
META_NAME = "run_meta.txt"

HEADER = [
    "iteration",
    "candidate_id",
    "score",
    "delta_vs_baseline",
    "decision",
    "hypothesis",
    "changes_summary",
]


def _run_dir(path: str | Path) -> Path:
    p = Path(path).resolve()
    p.mkdir(parents=True, exist_ok=True)
    return p


def _tsv_path(run_dir: Path) -> Path:
    return run_dir / TSV_NAME


def cmd_init(args: argparse.Namespace) -> int:
    run_dir = _run_dir(args.run_dir)
    tsv = _tsv_path(run_dir)
    if tsv.exists() and not args.force:
        print(f"Refusing to overwrite existing {tsv}. Use --force to re-init.", file=sys.stderr)
        return 1
    with tsv.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter="\t", quoting=csv.QUOTE_MINIMAL)
        w.writerow(HEADER)
    meta = run_dir / META_NAME
    lines = [
        f"created_utc={datetime.now(timezone.utc).isoformat()}",
        f"target_skill_name={args.target_skill_name or ''}",
        f"note={args.note or ''}",
    ]
    meta.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(tsv)
    return 0


def cmd_append(args: argparse.Namespace) -> int:
    run_dir = Path(args.run_dir).resolve()
    tsv = _tsv_path(run_dir)
    if not tsv.is_file():
        print(f"Missing {tsv}. Run: init first.", file=sys.stderr)
        return 1
    row = [
        str(args.iteration),
        args.candidate_id,
        str(args.score),
        str(args.delta_vs_baseline),
        args.decision,
        args.hypothesis or "",
        args.changes_summary or "",
    ]
    with tsv.open("a", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter="\t", quoting=csv.QUOTE_MINIMAL)
        w.writerow(row)
    print(f"appended -> {tsv}")
    return 0


def _text(el: ET.Element | None) -> str:
    if el is None:
        return ""
    return "".join(el.itertext()).strip()


def _find_child(parent: ET.Element, name: str) -> ET.Element | None:
    for child in parent:
        if child.tag == name:
            return child
    return None


def _extract_evolve_response_blob(raw: str) -> str:
    """Isolate <evolve_response>...</evolve_response> if the file has surrounding text."""
    m = re.search(
        r"<evolve_response\b[^>]*>.*?</evolve_response>",
        raw,
        flags=re.DOTALL | re.IGNORECASE,
    )
    if m:
        return m.group(0)
    return raw.strip()


def cmd_import_response(args: argparse.Namespace) -> int:
    run_dir = Path(args.run_dir).resolve()
    tsv = _tsv_path(run_dir)
    if not tsv.is_file():
        print(f"Missing {tsv}. Run: init first.", file=sys.stderr)
        return 1

    if args.file == "-":
        raw = sys.stdin.read()
    else:
        raw = Path(args.file).read_text(encoding="utf-8")

    blob = _extract_evolve_response_blob(raw)
    try:
        root = ET.fromstring(blob)
    except ET.ParseError as e:
        print(f"XML parse error: {e}", file=sys.stderr)
        return 1

    if root.tag.lower() != "evolve_response":
        print("Root element must be evolve_response.", file=sys.stderr)
        return 1

    log_el = _find_child(root, "experiment_log")
    if log_el is None:
        for el in root.iter():
            if el.tag == "experiment_log":
                log_el = el
                break
    if log_el is None:
        print("No <experiment_log> found.", file=sys.stderr)
        return 1

    iterations = [el for el in log_el if el.tag == "iteration"]
    if not iterations:
        print("No <iteration> entries under experiment_log.", file=sys.stderr)
        return 1

    rows_out: list[list[str]] = []
    for it in iterations:
        idx = it.attrib.get("index", "")
        cid_el = _find_child(it, "candidate_id")
        score_el = _find_child(it, "score")
        delta_el = _find_child(it, "delta_vs_baseline")
        dec_el = _find_child(it, "decision")
        hyp_el = _find_child(it, "hypothesis")
        ch_el = _find_child(it, "changes_summary")
        rows_out.append(
            [
                idx,
                _text(cid_el),
                _text(score_el),
                _text(delta_el),
                _text(dec_el),
                _text(hyp_el),
                _text(ch_el),
            ]
        )

    with tsv.open("a", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter="\t", quoting=csv.QUOTE_MINIMAL)
        for row in rows_out:
            w.writerow(row)

    print(f"appended {len(rows_out)} row(s) -> {tsv}")

    if args.write_best:
        best_el = _find_child(root, "best_skill_prompt")
        if best_el is not None:
            out = run_dir / "best_skill_prompt.txt"
            out.write_text(_text(best_el) + "\n", encoding="utf-8")
            print(f"wrote {out}")

    return 0


def cmd_stats(args: argparse.Namespace) -> int:
    run_dir = Path(args.run_dir).resolve()
    tsv = _tsv_path(run_dir)
    if not tsv.is_file():
        print(f"Missing {tsv}.", file=sys.stderr)
        return 1
    with tsv.open(newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f, delimiter="\t"))
    if len(rows) < 2:
        print("0 data rows (header only).")
        return 0
    data = rows[1:]
    print(f"rows: {len(data)}")
    if args.require_min_rows and len(data) < args.require_min_rows:
        print(
            f"FAIL: need >= {args.require_min_rows} rows, got {len(data)}",
            file=sys.stderr,
        )
        return 1
    return 0


def main() -> int:
    p = argparse.ArgumentParser(
        description="EVOLVE_AUTORESEARCH TSV experiment log (Karpathy-style append-only)."
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    p_init = sub.add_parser("init", help="Create run directory and empty experiments.tsv")
    p_init.add_argument("--run-dir", required=True, help="Directory for this autoresearch run")
    p_init.add_argument("--target-skill-name", default="", dest="target_skill_name")
    p_init.add_argument("--note", default="")
    p_init.add_argument(
        "--force",
        action="store_true",
        help="Overwrite experiments.tsv if it already exists",
    )
    p_init.set_defaults(func=cmd_init)

    p_app = sub.add_parser("append", help="Append one experiment row")
    p_app.add_argument("--run-dir", required=True)
    p_app.add_argument("--iteration", type=int, required=True)
    p_app.add_argument("--candidate-id", required=True)
    p_app.add_argument("--score", type=float, required=True)
    p_app.add_argument("--delta-vs-baseline", type=float, required=True)
    p_app.add_argument("--decision", required=True, choices=("keep", "discard", "crash"))
    p_app.add_argument("--hypothesis", default="")
    p_app.add_argument("--changes-summary", default="")
    p_app.set_defaults(func=cmd_append)

    p_imp = sub.add_parser(
        "import-response",
        help="Parse <evolve_response> XML and append all <iteration> rows",
    )
    p_imp.add_argument("--run-dir", required=True)
    p_imp.add_argument(
        "--file",
        required=True,
        help="Path to XML file, or - for stdin",
    )
    p_imp.add_argument(
        "--write-best",
        action="store_true",
        help="Also write <best_skill_prompt> to best_skill_prompt.txt",
    )
    p_imp.set_defaults(func=cmd_import_response)

    p_st = sub.add_parser("stats", help="Count TSV data rows (optional quality gate)")
    p_st.add_argument("--run-dir", required=True)
    p_st.add_argument(
        "--require-min-rows",
        type=int,
        default=0,
        help="Exit 1 if fewer than this many data rows",
    )
    p_st.set_defaults(func=cmd_stats)

    args = p.parse_args()
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main())
