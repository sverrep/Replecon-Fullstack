from email.policy import HTTP
from rest_framework import status, generics, mixins
from rest_framework.permissions import AllowAny, DjangoModelPermissions
from sqlalchemy import false, true
from .models import Classroom
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from .serializers import ClassroomSerializer
from policies import checkInq
from rest_framework.response import Response


# Create your views here.
@method_decorator(csrf_protect, name="dispatch")
class ClassroomList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        if checkInq(request.method, "classroom", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        if checkInq(request.method, "classroom", request.user.groups.get().name) == True:
            return self.create(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class ClassroomDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [DjangoModelPermissions]

    lookup_field = 'id'

    def get(self, request, id):
        if checkInq(request.method, "classroom", request.user.groups.get().name) == True:
            return self.retrieve(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        if checkInq(request.method, "classroom", request.user.groups.get().name) == True:
            return self.update(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def delete(self, request, id):
        if checkInq(request.method, "classroom", request.user.groups.get().name) == True:
            return self.destroy(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

