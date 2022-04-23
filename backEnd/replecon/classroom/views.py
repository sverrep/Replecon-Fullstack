from rest_framework import status, generics, mixins
from rest_framework.permissions import AllowAny, DjangoModelPermissions
from sqlalchemy import false, true
from .models import Classroom
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
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
        if checkInq(request.method, "classroom", request.user.groups.get(), {"CSRF": '127.0.0.1'}) == True:
            return self.list(request)
        return Response(status=status.HTTP_400_BAD_REQUEST)

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

