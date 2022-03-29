from django.shortcuts import render
from rest_framework import viewsets, generics, mixins
from rest_framework.permissions import AllowAny, DjangoModelPermissions
from .models import Classroom
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from .serializers import ClassroomSerializer


# Create your views here.

@method_decorator(ensure_csrf_cookie, name="dispatch")
class ClassroomList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)

class ClassroomDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [DjangoModelPermissions]

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)
    
    def delete(self, request, id):
        return self.destroy(request, id=id)

