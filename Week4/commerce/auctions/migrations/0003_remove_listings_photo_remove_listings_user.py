# Generated by Django 4.1.2 on 2022-11-14 00:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0002_listings_comments_bids'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listings',
            name='photo',
        ),
        migrations.RemoveField(
            model_name='listings',
            name='user',
        ),
    ]
