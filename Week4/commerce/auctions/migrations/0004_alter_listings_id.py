# Generated by Django 4.1.2 on 2022-11-14 01:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0003_remove_listings_photo_remove_listings_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listings',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
