from rest_framework import status, generics, mixins
from .serializers import TaxSerializer, ProgressiveBracketSerializer, RegressiveBracketSerializer
from .models import Tax, ProgressiveBracket, RegressiveBracket
from rest_framework.permissions import DjangoModelPermissions
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from policies import checkInq
from rest_framework.response import Response

@method_decorator(csrf_protect, name="dispatch")
class TaxList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer
    permission_classes = [DjangoModelPermissions]

    def get(self, request):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def post(self, request):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.create(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class TaxDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer
    permission_classes = [DjangoModelPermissions]

    lookup_field = 'id'

    def get(self, request, id):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.retrieve(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.update(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def delete(self, request, id):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.destroy(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class ProgressiveBracketList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = ProgressiveBracket.objects.all()
    serializer_class = ProgressiveBracketSerializer
    permission_classes = [DjangoModelPermissions]
    
    def get(self, request):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def post(self, request):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.create(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class ProgressiveBracketDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = ProgressiveBracket.objects.all()
    serializer_class = ProgressiveBracketSerializer
    permission_classes = [DjangoModelPermissions]

    lookup_field = 'id'

    def get(self, request, id):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.retrieve(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.update(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def delete(self, request, id):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.destroy(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class RegressiveBracketList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = RegressiveBracket.objects.all()
    serializer_class = RegressiveBracketSerializer
    permission_classes = [DjangoModelPermissions]

    def get(self, request):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def post(self, request):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.create(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class RegressiveBracketDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = RegressiveBracket.objects.all()
    serializer_class = RegressiveBracketSerializer
    permission_classes = [DjangoModelPermissions]

    lookup_field = 'id'

    def get(self, request, id):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.retrieve(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.update(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def delete(self, request, id):
        if checkInq(request.method, "tax", request.user.groups.get().name) == True:
            return self.destroy(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
