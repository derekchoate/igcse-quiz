#!/usr/bin/env python3
"""
Self-check for course-language-editor.

Reports, per paragraph and overall: word count, average/longest sentence length,
Flesch-Kincaid grade level, paragraphs and sentences that look worth splitting, and
sentence pairs that look like redundant restatement.

Usage:
    python3 readability_check.py <file>       # plain text, paragraphs = blank-line separated
    python3 readability_check.py <file> --html  # strips HTML tags first, paragraphs = <p> blocks
    python3 readability_check.py -            # read from stdin
    python3 readability_check.py - --html

This is a first-pass tool, not a gate. It flags candidates for a human (or the model
using this skill) to judge — a flagged long sentence built around one unavoidable
syllabus term is often fine to leave; a flagged "duplicate" pair is sometimes a
deliberate house-style repeat. See SKILL.md step 6.
"""

import re
import sys
from difflib import SequenceMatcher

LONG_PARAGRAPH_WORDS = 40
LONG_SENTENCE_WORDS = 20
TARGET_GRADE = 8.0
DUPLICATE_SIMILARITY_THRESHOLD = 0.75


PROSE_BLOCK_RE = re.compile(
    r"<p[^>]*>(.*?)</p>"
    r'|<div\s+class="nudge"[^>]*>(.*?)</div>'
    r'|<div\s+class="promise"[^>]*>(.*?)</div>',
    flags=re.DOTALL | re.IGNORECASE,
)


def strip_html(text):
    # Pull out prose blocks in source order: <p> tags, nudge divs, and the promise
    # card — the three places learner-facing prose lives outside a <p>. A module's
    # interactive bits (boards, inputs, chip pools) aren't prose and fall out
    # naturally since they're never inside one of these three block types.
    blocks = []
    for match in PROSE_BLOCK_RE.finditer(text):
        blocks.append(next(g for g in match.groups() if g is not None))
    if not blocks:
        # No matching blocks found — fall back to treating the whole input as one
        # blob, split into pseudo-paragraphs on double line breaks after tag stripping.
        blocks = [text]
    cleaned = []
    for block in blocks:
        block = re.sub(r"<[^>]+>", " ", block)
        block = re.sub(r"&nbsp;", " ", block)
        block = re.sub(r"&amp;", "&", block)
        block = re.sub(r"\s+", " ", block).strip()
        if block:
            cleaned.append(block)
    return cleaned


def split_paragraphs_plain(text):
    paras = re.split(r"\n\s*\n", text.strip())
    return [p.strip().replace("\n", " ") for p in paras if p.strip()]


SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9\"'])")


def split_sentences(paragraph):
    # Heuristic splitter — good enough for a first-pass self-check, not a linguistic
    # parser. Doesn't try to handle abbreviations specially; false splits are rare
    # enough in this kind of short instructional prose not to matter.
    sentences = SENTENCE_SPLIT_RE.split(paragraph.strip())
    return [s.strip() for s in sentences if s.strip()]


def count_words(text):
    return len(re.findall(r"[A-Za-z0-9']+", text))


VOWEL_GROUPS_RE = re.compile(r"[aeiouy]+", re.IGNORECASE)


def count_syllables(word):
    word = word.lower().strip(".,!?;:\"'()")
    if not word:
        return 0
    groups = VOWEL_GROUPS_RE.findall(word)
    count = len(groups)
    if word.endswith("e") and not word.endswith("le") and count > 1:
        count -= 1
    return max(count, 1)


def flesch_kincaid_grade(text):
    sentences = split_sentences(text)
    words = re.findall(r"[A-Za-z']+", text)
    if not sentences or not words:
        return 0.0
    syllables = sum(count_syllables(w) for w in words)
    asl = len(words) / len(sentences)
    asw = syllables / len(words)
    return 0.39 * asl + 11.8 * asw - 15.59


def find_near_duplicates(sentences):
    pairs = []
    for i in range(len(sentences)):
        for j in range(i + 1, len(sentences)):
            a, b = sentences[i], sentences[j]
            if len(a) < 15 or len(b) < 15:
                continue  # too short for similarity to be meaningful
            ratio = SequenceMatcher(None, a.lower(), b.lower()).ratio()
            if ratio >= DUPLICATE_SIMILARITY_THRESHOLD:
                pairs.append((i, j, ratio, a, b))
    return pairs


def analyze_paragraph(paragraph, index):
    sentences = split_sentences(paragraph)
    word_count = count_words(paragraph)
    sentence_lengths = [count_words(s) for s in sentences]
    avg_len = sum(sentence_lengths) / len(sentence_lengths) if sentence_lengths else 0
    max_len = max(sentence_lengths) if sentence_lengths else 0
    grade = flesch_kincaid_grade(paragraph)

    print(f"\n--- Paragraph {index + 1} ---")
    print(f'"{paragraph[:100]}{"..." if len(paragraph) > 100 else ""}"')
    print(f"  words: {word_count} | sentences: {len(sentences)} | "
          f"avg sentence length: {avg_len:.1f} | longest: {max_len} | "
          f"grade level: {grade:.1f}")

    if word_count > LONG_PARAGRAPH_WORDS:
        print(f"  FLAG: paragraph is {word_count} words (over {LONG_PARAGRAPH_WORDS}) "
              f"— consider splitting into two.")

    for s, length in zip(sentences, sentence_lengths):
        if length > LONG_SENTENCE_WORDS:
            preview = s if len(s) <= 90 else s[:87] + "..."
            print(f"  FLAG: {length}-word sentence — consider splitting: \"{preview}\"")

    if grade > TARGET_GRADE:
        print(f"  FLAG: grade level {grade:.1f} is above the target of {TARGET_GRADE:.0f} "
              f"— check whether it's carrying an unavoidable syllabus term, or whether "
              f"there's still a seam to cut.")

    duplicates = find_near_duplicates(sentences)
    for i, j, ratio, a, b in duplicates:
        print(f"  FLAG: sentences {i + 1} and {j + 1} look similar ({ratio:.0%} match) "
              f"— possible restatement, not a deliberate repeat:")
        print(f"    [{i + 1}] {a}")
        print(f"    [{j + 1}] {b}")

    return word_count, sentence_lengths, grade


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)

    html_mode = "--html" in args
    args = [a for a in args if a != "--html"]
    source = args[0]

    if source == "-":
        text = sys.stdin.read()
    else:
        with open(source, "r", encoding="utf-8") as f:
            text = f.read()

    paragraphs = strip_html(text) if html_mode else split_paragraphs_plain(text)

    if not paragraphs:
        print("No paragraphs found.")
        sys.exit(0)

    total_words = 0
    all_sentence_lengths = []
    grades = []

    for i, para in enumerate(paragraphs):
        w, lens, grade = analyze_paragraph(para, i)
        total_words += w
        all_sentence_lengths.extend(lens)
        if lens:
            grades.append(grade)

    print("\n=== Overall ===")
    print(f"paragraphs: {len(paragraphs)} | total words: {total_words}")
    if all_sentence_lengths:
        avg = sum(all_sentence_lengths) / len(all_sentence_lengths)
        print(f"sentences: {len(all_sentence_lengths)} | "
              f"avg sentence length: {avg:.1f} | longest: {max(all_sentence_lengths)}")
    if grades:
        print(f"avg grade level across paragraphs: {sum(grades) / len(grades):.1f} "
              f"(target: at or under {TARGET_GRADE:.0f})")


if __name__ == "__main__":
    main()
