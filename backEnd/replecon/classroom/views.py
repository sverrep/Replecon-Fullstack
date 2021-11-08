from django.shortcuts import render
from rest_framework import viewsets, generics, mixins
from rest_framework.permissions import AllowAny
from .models import Classroom
from .serializers import ClassroomSerializer


# Create your views here.

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

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)
    
    def delete(self, request, id):
        return self.destroy(request, id=id)

