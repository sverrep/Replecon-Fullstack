# Generated by Django 3.2 on 2021-04-28 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_teacher'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='balance',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15),
        ),
    ]