# Generated by Django 4.1.2 on 2022-11-18 05:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0007_remove_watchlist_listing_remove_watchlist_user_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Bids',
            new_name='Bid',
        ),
        migrations.RenameModel(
            old_name='Comments',
            new_name='Comment',
        ),
        migrations.RenameModel(
            old_name='Listings',
            new_name='Listing',
        ),
    ]