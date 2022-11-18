# Generated by Django 4.1.2 on 2022-11-18 06:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0011_remove_watchlist_listing_watchlist_listing'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='watchlist',
            name='listing',
        ),
        migrations.AddField(
            model_name='watchlist',
            name='listing',
            field=models.ManyToManyField(related_name='watchlists', to='auctions.listing'),
        ),
    ]
