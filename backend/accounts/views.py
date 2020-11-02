from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
# from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from django.contrib.auth import get_user_model
from django.contrib.auth import login as auth_login, logout as auth_logout, get_user_model

from django.contrib.auth.decorators import login_required
from .serializers import UserSerializer
from django.http import HttpResponse
import json
import base64
from django.core.files.base import ContentFile
import os
# from rest_framework.serializers import ModelSerializer

# from django.views.decorators.csrf import csrf_exempt
# from articles.models import Article

User = get_user_model()

# Create your views here.
# @csrf_exempt


class Result():
    def __init__(self):
        self.data = ''


@api_view(['GET'])
def profile(request, email):
    # user = get_object_or_404(User, uid=user_id)
    # articles = Article.objects.filter(user=user.id)
    user = get_object_or_404(User, email=email)
    serializer = UserSerializer(user)

    return Response(serializer.data)
    # return Response(context)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def need(request):
    user = get_object_or_404(User, id=request.user.id)
    save_data = request.data
    if save_data['sex'] == 'male':
        basal_metabolism = 1500
    elif save_data['sex'] == 'female':
        basal_metabolism = 1000

    save_data['basal_metabolism'] = int(basal_metabolism)
    serializer = UserSerializer(user, data=save_data, partial=True)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def need_info(request):
    print(request.data)
    user = get_object_or_404(User, id=request.user.id)
    save_data = request.data
    if user.sex == 'male':
        basal_metabolism = 66.47 + \
            (13.75 * int(save_data['weight'])) + (5 *
                                                  int(save_data['height'])) - (6.76 * int(save_data['age']))
    elif user.sex == 'female':
        basal_metabolism = 655.1 + \
            (9.56 * int(save_data['weight'])) + (1.85 *
                                                 int(save_data['height'])) - (4.68 * int(save_data['age']))

    if save_data['active'] == 'high':
        basal_metabolism *= 1.1
    elif save_data['active'] == 'low':
        basal_metabolism *= 0.9

    save_data['basal_metabolism'] = int(basal_metabolism)
    serializer = UserSerializer(user, data=save_data, partial=True)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_info(request):
    user = get_object_or_404(User, id=request.user.id)
    save_data = {}
    save_data['age'] = int(request.data['age'])
    save_data['weight'] = int(request.data['weight'])
    save_data['height'] = int(request.data['height'])
    basal_metabolism = 0
    if request.user.sex == 'male':
        basal_metabolism = 66.47 + \
            (13.75 * save_data['weight']) + (5 *
                                             save_data['height']) - (6.76 * save_data['age'])
    elif request.user.sex == 'female':
        basal_metabolism = 655.1 + \
            (9.56 * save_data['weight']) + (1.85 *
                                            save_data['height']) - (4.68 * save_data['age'])
    if request.data['active'] == 'high':
        basal_metabolism *= 1.1
    elif request.data['active'] == 'low':
        basal_metabolism *= 0.9

    save_data['basal_metabolism'] = int(basal_metabolism)
    serializer = UserSerializer(user, data=save_data, partial=True)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profileImage(request):
    user = request.user
    old_img = 'media/' + str(user.profileImage)

    decoded_data = base64.b64decode(request.data['data'])
    new_profileImg = ContentFile(
        decoded_data, name=f"image/{request.data['fileName']}")
    save_data = {}
    save_data['profileImage'] = new_profileImg
    user = request.user
    print('이름:', user.username)
    serializer = UserSerializer(user, data=save_data, partial=True)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        if os.path.isfile(old_img):
            os.remove(old_img)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def del_profile(request):
    user = request.user
    if user.profileImage:
        old_img = 'media/' + str(user.profileImage)
        user.profileImage.delete(save=True)
        if os.path.isfile(old_img):
            os.remove(old_img)
        return Response('프로필이미지 삭제')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def userdelete(request, username):
    user = get_object_or_404(User, username=username)
    if request.method == 'POST':
        user.delete()
        # request.user.delete()
        return Response('탈퇴하였습니다.')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow(request, username):
    user = get_object_or_404(User, username=username)
    if user != request.user:
        if user.followers.filter(id=request.user.id).exists():
            user.followers.remove(request.user)
            user.num_of_followers -= 1
            user.save()

            request.user.followings.remove(user)
            request.user.num_of_followings -= 1
            request.user.save()

            result = {"result": "팔로우 취소"}
            result = json.dumps(result)
            return HttpResponse(result, content_type=u"application/json; charset=utf-8")

        else:
            user.followers.add(request.user)
            user.num_of_followers += 1
            user.save()
            request.user.followings.add(user)
            request.user.num_of_followings += 1
            request.user.save()

            result = {"result": "팔로우 성공"}
            result = json.dumps(result)
            return HttpResponse(result, content_type=u"application/json; charset=utf-8")


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def isfollow(request, username):
    user = get_object_or_404(User, username=username)
    if user.followers.filter(id=request.user.id).exists():
        result = {"follow": "True"}
        result = json.dumps(result)
        return Response(True)
    else:
        result = {"follow": "False"}
        result = json.dumps(result)
        return Response(False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_basal(request):
    return Response(int(request.user.basal_metabolism))


@api_view(['POST'])
def getBestUsers(request):
    BestUsers = User.objects.order_by('-num_of_followers')[:5]
    lst = []
    for BestUser in BestUsers:
        serializer = UserSerializer(BestUser)
        lst.append(serializer.data)
    return Response(lst)
