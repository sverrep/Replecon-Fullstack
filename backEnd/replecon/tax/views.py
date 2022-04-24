from rest_framework import generics, mixins
from .serializers import TaxSerializer, ProgressiveBracketSerializer, RegressiveBracketSerializer
from .models import Tax, ProgressiveBracket, RegressiveBracket
from rest_framework.permissions import DjangoModelPermissions
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator

@method_decorator(csrf_protect, name="dispatch")
class TaxList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer
    permission_classes = [DjangoModelPermissions]

    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)

@method_decorator(csrf_protect, name="dispatch")
class TaxDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer
    permission_classes = [DjangoModelPermissions]

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)
    
    def delete(self, request, id):
        return self.destroy(request, id=id)

@method_decorator(csrf_protect, name="dispatch")
class ProgressiveBracketList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = ProgressiveBracket.objects.all()
    serializer_class = ProgressiveBracketSerializer
    permission_classes = [DjangoModelPermissions]
    
    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)

@method_decorator(csrf_protect, name="dispatch")
class ProgressiveBracketDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = ProgressiveBracket.objects.all()
    serializer_class = ProgressiveBracketSerializer
    permission_classes = [DjangoModelPermissions]

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)
    
    def delete(self, request, id):
        return self.destroy(request, id=id)

@method_decorator(csrf_protect, name="dispatch")
class RegressiveBracketList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = RegressiveBracket.objects.all()
    serializer_class = RegressiveBracketSerializer
    permission_classes = [DjangoModelPermissions]

    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)

@method_decorator(csrf_protect, name="dispatch")
class RegressiveBracketDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = RegressiveBracket.objects.all()
    serializer_class = RegressiveBracketSerializer
    permission_classes = [DjangoModelPermissions]

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)
    
    def delete(self, request, id):
        return self.destroy(request, id=id)
