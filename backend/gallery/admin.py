from django.contrib import admin
from .models import Menu

# Register your models here.


class MenuAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'image')


admin.site.register(Menu, MenuAdmin)
