"""Captions for the Videos view, transcribed from each film's own narration.

    CUDA_VISIBLE_DEVICES= uv run --no-project --with faster-whisper python scripts/transcribe-films.py <dir with truck.mp4 ...>

Writes <name>.vtt beside each film. Runs on CPU (int8, small.en). The films are served by the
content-ideas Pages site (see app/views/films.tsx for the URLs). Automatic transcripts mishear
product names and units; read each file and correct them before copying to public/media/captions/.
Corrections made in September 2026: cab (not cap), front and rear radar, 120-degree side cameras,
AD2 (heard as 82), brakes, pick run, badge, escalation ladder, tapeout.
"""
import sys
from pathlib import Path
from faster_whisper import WhisperModel

NAMES = ['master', 'truck', 'computebox', 'ddrive', 'forklift', 'yard', 'sentinel']


def ts(t: float) -> str:
    return f'{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{t % 60:06.3f}'


def main(folder: Path) -> None:
    model = WhisperModel('small.en', device='cpu', compute_type='int8')
    for name in NAMES:
        segments, _ = model.transcribe(str(folder / f'{name}.mp4'), vad_filter=True, beam_size=5)
        lines = ['WEBVTT', '']
        for s in segments:
            lines += [f'{ts(s.start)} --> {ts(s.end)}', s.text.strip(), '']
        (folder / f'{name}.vtt').write_text('\n'.join(lines))
        print('captioned', name, flush=True)


if __name__ == '__main__':
    main(Path(sys.argv[1] if len(sys.argv) > 1 else '.'))
