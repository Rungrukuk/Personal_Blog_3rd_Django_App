# Generated by Django 4.2.3 on 2023-09-02 14:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BlogApp', '0004_remove_blogpost_description'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blogpost',
            name='blog_image',
        ),
        migrations.AddField(
            model_name='blogpost',
            name='blog_image_url',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]