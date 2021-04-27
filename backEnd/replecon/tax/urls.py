from django.urls import path, include
from .views import TaxList, TaxDetails, ProgressiveBracketList, ProgressiveBracketDetails, RegressiveBracketList, RegressiveBracketDetails


urlpatterns = [
    path('taxes/', TaxList.as_view()),
    path('taxes/<int:id>', TaxDetails.as_view()),
    path('progressivebrackets/', ProgressiveBracketList.as_view()),
    path('progressivebrackets/<int:id>', ProgressiveBracketDetails.as_view()),
    path('regressivebrackets/', RegressiveBracketList.as_view()),
    path('regressivebrackets/<int:id>', RegressiveBracketDetails.as_view()),
]
