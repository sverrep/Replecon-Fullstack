# Generated by Django 3.2 on 2021-04-25 13:43

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ProgressiveBracket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tax_id', models.IntegerField()),
                ('lower_bracket', models.DecimalField(decimal_places=2, max_digits=5)),
                ('higher_bracket', models.DecimalField(decimal_places=2, max_digits=5)),
                ('percentage', models.DecimalField(decimal_places=2, max_digits=5)),
            ],
        ),
        migrations.CreateModel(
            name='RegressiveBracket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tax_id', models.IntegerField()),
                ('lower_bracket', models.DecimalField(decimal_places=2, max_digits=5)),
                ('higher_bracket', models.DecimalField(decimal_places=2, max_digits=5)),
                ('percentage', models.DecimalField(decimal_places=2, max_digits=5)),
            ],
        ),
        migrations.CreateModel(
            name='Tax',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('class_code', models.CharField(max_length=6)),
                ('sales_tax', models.DecimalField(decimal_places=2, max_digits=5)),
                ('percentage_tax', models.DecimalField(decimal_places=2, max_digits=5)),
                ('flat_tax', models.DecimalField(decimal_places=2, max_digits=6)),
            ],
        ),
    ]