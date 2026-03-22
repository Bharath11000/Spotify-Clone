"""
Management command to seed sample data.
Run: python manage.py seed_data

Creates 3 artists, 3 albums, and 9 tracks with dummy audio files.
All files are tiny valid MP3 headers so the frontend audio player can
at least load them without 404 errors.
"""

import os
import struct
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.contrib.auth import get_user_model
from music.models import Artist, Album, Track

User = get_user_model()

# Minimal valid MP3 frame (silent, ~0.02 sec) so browsers don't reject the file
SILENT_MP3 = bytes([
    0xFF, 0xFB, 0x90, 0x00,  # MPEG1, Layer3, 128kbps, 44100Hz, stereo
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]) * 10  # Repeat to make it slightly longer

SAMPLE_DATA = [
    {
        'artist': 'The Midnight',
        'bio': 'Synthwave duo blending nostalgia with electronic music.',
        'albums': [
            {
                'title': 'Monsters',
                'year': 2022,
                'tracks': [
                    ('Monsters', 210),
                    ('You & Me', 195),
                    ('Synthetic Diamond', 230),
                ],
            },
        ],
    },
    {
        'artist': 'Tame Impala',
        'bio': 'Australian psychedelic music project.',
        'albums': [
            {
                'title': 'Currents',
                'year': 2015,
                'tracks': [
                    ('Let It Happen', 467),
                    ("The Less I Know the Better", 216),
                    ('New Person, Same Old Mistakes', 361),
                ],
            },
        ],
    },
    {
        'artist': 'Daft Punk',
        'bio': 'Legendary French electronic music duo.',
        'albums': [
            {
                'title': 'Random Access Memories',
                'year': 2013,
                'tracks': [
                    ('Get Lucky', 248),
                    ('Instant Crush', 337),
                    ('Lose Yourself to Dance', 292),
                ],
            },
        ],
    },
]


class Command(BaseCommand):
    help = 'Seed the database with sample artists, albums, and tracks'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Create demo user if not exists
        if not User.objects.filter(email='demo@spotify.com').exists():
            User.objects.create_user(
                email='demo@spotify.com',
                username='demo_user',
                password='demo1234',
            )
            self.stdout.write(self.style.SUCCESS('Created demo user: demo@spotify.com / demo1234'))

        track_count = 0
        for data in SAMPLE_DATA:
            artist, created = Artist.objects.get_or_create(
                name=data['artist'],
                defaults={'bio': data['bio']},
            )
            if created:
                self.stdout.write(f'  Created artist: {artist.name}')

            for album_data in data['albums']:
                album, created = Album.objects.get_or_create(
                    title=album_data['title'],
                    artist=artist,
                    defaults={'release_year': album_data['year']},
                )
                if created:
                    self.stdout.write(f'    Created album: {album.title}')

                for i, (track_title, duration) in enumerate(album_data['tracks'], start=1):
                    if not Track.objects.filter(title=track_title, artist=artist).exists():
                        track = Track(
                            title=track_title,
                            artist=artist,
                            album=album,
                            duration=duration,
                            track_number=i,
                        )
                        # Save a tiny dummy MP3 as the audio file
                        filename = f"{track_title.lower().replace(' ', '_')}.mp3"
                        track.audio_file.save(filename, ContentFile(SILENT_MP3), save=False)
                        track.save()
                        track_count += 1
                        self.stdout.write(f'      Created track: {track.title}')

        self.stdout.write(self.style.SUCCESS(
            f'\nDone! Seeded {track_count} tracks. '
            'Login at http://localhost:5173 with demo@spotify.com / demo1234'
        ))