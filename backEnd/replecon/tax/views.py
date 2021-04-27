from django.shortcuts import render
from rest_framework import viewsets, generics, mixins, viewsets, status
from .serializers import TaxSerializer, ProgressiveBracketSerializer, RegressiveBracketSerializer
from .models import Tax, ProgressiveBracket, RegressiveBracket

class TaxList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer

    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)

class TaxDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)
    
    def delete(self, request, id):
        return self.destroy(request, id=id)

class ProgressiveBracketList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = ProgressiveBracket.objects.all()
    serializer_class = ProgressiveBracketSerializer
    
    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)

class ProgressiveBracketDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = ProgressiveBracket.objects.all()
    serializer_class = ProgressiveBracketSerializer

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)
    
    def delete(self, request, id):
        return self.destroy(request, id=id)

class RegressiveBracketList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = RegressiveBracket.objects.all()
    serializer_class = RegressiveBracketSerializer

    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)

class RegressiveBracketDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = RegressiveBracket.objects.all()
    serializer_class = RegressiveBracketSerializer

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)
    
    def delete(self, request, id):
        return self.destroy(request, id=id)
