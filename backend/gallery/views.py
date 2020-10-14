from django.shortcuts import render, get_object_or_404
from .models import Menu
from .models import Menu2food
from .models import Food

from .serializers import MenuSerializer
from accounts.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.core.files.base import ContentFile
# from PIL import Image

import base64
# from django.http import FileResponse
# Create your views here.
from keras.models import load_model
from keras.preprocessing import image
import cv2
import numpy as np
from matplotlib import pyplot as plt


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def saveMenu(request):
    def predict_img(uri):
        net = cv2.dnn.readNet("yolov2-food100.weights", "yolo-food100.cfg")
        classes = []
        with open("food100.names", "r") as f:
            classes = [line.strip() for line in f.readlines()]
        layer_names = net.getLayerNames()
        output_layers = [layer_names[i[0] - 1]
                         for i in net.getUnconnectedOutLayers()]
        colors = np.random.uniform(0, 255, size=(len(classes), 3))

        img_path = uri
        img = cv2.imread(img_path)
        height, width, channels = img.shape

        blob = cv2.dnn.blobFromImage(
            img, 0.00392, (416, 416), (0, 0, 0), True, crop=True)  # 네트워크에 넣기 위한 전처리
        net.setInput(blob)  # 전처리된 blob 네트워크에 입력
        outs = net.forward(output_layers)  # 결과 받아오기

        class_ids = []
        confidences = []
        boxes = []
        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.3:
                    # 탐지된 객체의 너비, 높이 및 중앙 좌표값 찾기
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    # print(center_x,center_y)
                    w = abs(int(detection[2] * width))
                    h = abs(int(detection[3] * height))
                    # print(w,h)
                    # 객체의 사각형 테두리 중 좌상단 좌표값 찾기
                    x = abs(int(center_x - w / 2))
                    y = abs(int(center_y - h / 2))
                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)
        # Non Maximum Suppression (겹쳐있는 박스 중 confidence 가 가장 높은 박스를 선택)
        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.3, 0.3)
        # 최종적으로 indexes에 음식에 매치된 번호가 들어감 boxes에는 검출돤 하나의 음식에 대한 좌표
        font = cv2.FONT_HERSHEY_PLAIN
        det_foods = []
        for i in range(len(boxes)):  # 검출된 음식 개수만큼 돔
            if i in indexes:  # i에 검출된 음식 번호
                x, y, w, h = boxes[i]
                class_name = classes[class_ids[i]]
                label = f"{class_name} {boxes[i]}"
                det_foods.append(label)
                # print(class_name) # 검출된 음식 이름 ex) pizza ..
                # print(confidences[i]) #검출된 확률
                color = colors[i]
                # 사각형 테두리 그리기 및 텍스트 쓰기
                cv2.rectangle(img, (x, y), (x + w, y + h), color, 2)
                cv2.rectangle(img, (x - 1, y),
                              (x + len(class_name) * 13, y - 12), color, -1)
                cv2.putText(img, class_name, (x, y - 4),
                            cv2.FONT_HERSHEY_COMPLEX_SMALL, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
        # 리스트 형식으로 반환
        # 사진은 반환 어케?
        return det_foods, img  # 여기서 img는 사용자에게 뿌릴 이미지

    new_menu = Menu()
    new_menu.user = request.user
    # type, fileName, data << 각각 프론트에서 보낼 수 있는 데이터
    decoded_data = base64.b64decode(request.data['data'])
    new_menu.image = ContentFile(
        decoded_data, name=f"{request.data['fileName']}")  # url
    print(type(new_menu.image))
    # predict_img(new_menu.image)
    new_menu.save()  # insert

    foodlist, img = predict_img('media/' + str(new_menu.image))
    print(foodlist)
    my_dict = {'rice': '쌀밥 한 공기',
               'eels-on-rice': '장어덮밥',
               'pilaf': '한우소고기필라프',
               'chicken-n-egg-on-rice': '전복치킨진밥',
               'pork-cutlet-on-rice': '등심돈가스',
               'beef-curry': '카레라이스',
               'sushi': '초밥, 모듬 초밥',
               'chicken-rice': '치킨까스',
               'fried-rice': '계란볶음밥',
               'tempura-bowl': '채소튀김',
               'bibimbap': '정성가득비빔밥',
               'toast': '베이컨 치즈 토스트',
               'croissant': '빵, 크로와상',
               'roll-bread': '빵, 하드 롤빵',
               'raisin-bread': '건포도토종효모빵용 빵',
               'chip-butty': '허니버터칩메이플시럽',
               'hamburger': '햄버거, 소고기패티',
               'pizza': '피자',
               'sandwiches': '샌드위치',
               'udon-noodle': '우동',
               'tempura-udon': '튀김우동',
               'soba-noodle': '메밀소바',
               'ramen-noodle': '돈코츠라멘',
               'beef-noodle': '즉석쌀국수',
               'tensin-noodle': '사누끼 생칼국수',
               'fried-noodle': '튀김우동 큰사발',
               'spaghetti': '스파게티',
               'Japanese-style-pancake': '케이크, 팬케이크',
               'takoyaki': '타코야끼볼',
               'gratin': '콘치즈그라탕',
               'sauteed-vegetables': 'LOTTE 야채크래커',
               'croquette': '빵, 크로켓',
               'grilled-eggplant': '가치, 구운것',
               'sauteed-spinach': '시금치, 볶은것',
               'vegetable-tempura': '야채전',
               'miso-soup': '일본된장국',
               'potage': '카메다 포타포타야키',
               'sausage': '그릴소세지',
               'oden': '어묵국',
               'omelet': '오믈렛',
               'ganmodoki': '두부류 또는 묵류',
               'jiaozi': '감자떡만두',
               'stew': '스튜, 레토르트',
               'teriyaki-grilled-fish': '가자미구이',
               'fried-fish': '생선까스',
               'grilled-salmon': '연어-훈제품',
               'salmon-meuniere': '연어',
               'sashimi': '사시미',
               'grilled-pacific-saury-': '꽁치',
               'sukiyaki': '소고기샤브샤브',
               'sweet-and-sour-pork': '돼지고기, 갈비, 구운것(팬)',
               'lightly-roasted-fish': '고등어구이',
               'steamed-egg-hotchpotch': '계란사라다빵',
               'tempura': '모둠튀김',
               'fried-chicken': '갓치킨',
               'sirloin-cutlet': '덴까스 립',
               'nanbanzuke': '돈까스',
               'boiled-fish': '고등어찌개',
               'seasoned-beef-with-potatoes': '감자샐러드',
               'hambarg-steak': '햄버거',
               'beef-steak': '블랙앵거스 스테이크(오리지널 M)',
               'dried-fish': '고등어, 반건조',
               'ginger-pork-saute': '돼지고기장조림',
               'spicy-chili-flavored-tofu': '무조림',
               'yakitori': '쿠리 이리 도라야키',
               'cabbage-roll': '달걀부침, 부친것',
               'rolled-omelet': '달걀말이',
               'egg-sunny-side-up': '달걀프라이',
               'fermented-soybeans': '나토',
               'cold-tofu': '무조림',
               'egg-roll': '에그롤',
               'chilled-noodle': '막국수',
               'stir-fried-beef-and-peppers': '돼지고기장조림',
               'simmered-pork': '돼지고기장조림',
               'boiled-chicken-and-vegetables': '케이준치킨샐러드',
               'sashimi-bowl': '생선모둠초밥',
               'sushi-bowl': '생선모둠초밥',
               'fish-shaped-pancake-with-bean-jam': '팬케이크',
               'shrimp-with-chill-source': '칠리새우',
               'roast-chicken': 'The 오븐치킨',
               'steamed-meat-dumpling': '만두, 고기 만두',
               'omelet-with-fried-rice': '볶음밥, 오므라이스',
               'cutlet-curry': '비프 청크 카레',
               'spaghetti-meat-sauce': '미트라구 파스타',
               'fried-shrimp': '새우튀김',
               'potato-salad': '감자 샐러드',
               'green-salad': '양배추 샐러드, 코울슬로',
               'macaroni-salad': '파스타, 마카로니',
               'Japanese-tofu-and-vegetable-chowder': '야채빵',
               'pork-miso-soup': '된장찌개',
               'chinese-soup': '치즈, 크림',
               'beef-bowl': '된장찌개',
               'kinpira-style-sauteed-burdock': '우엉조림',
               'rice-ball': '쇠고기주먹밥',
               'pizza-toast': '피자토스트',
               'dipping-noodles': '칼국수, 해물',
               'hot-dog': '옛날 핫도그',
               'french-fries': '감자튀김',
               'mixed-rice': '볶음밥, 오므라이스',
               'goya-chanpuru': '두부전'
               }
    # menu2food에 값넣기
    for i in range(len(foodlist)):
        idx = foodlist[i].find("[")
        new_food = Menu2food()
        fname = foodlist[i][0:idx].strip()
        kfoodName = my_dict[fname]
        # input_menu = get_object_or_404(Menu, id=new_menu.id)
        foods = get_object_or_404(Food, DESC_KOR=kfoodName)
        # new_food.food 는 같은 이름 찾아서 넣어야댐
        new_food.location = foodlist[i][idx:]  # 좌표값
        new_food.image = new_menu
        new_food.food = foods
        new_food.save()
    # predict = predict_img('media/' + str(new_menu.image)) #db 저장 위치
    return Response("파일을 저장했습니다.")
    # response = FileResponse(open(f"media/image/{request.data['fileName']}", 'rb'))
    # return response


@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def delImg(request, image_id):
    image = get_object_or_404(Menu, pk=image_id)
    if image.user == request.user or request.user.is_superuser:
        image.delete()
        return Response("이미지가 삭제되었습니다.")

# 내 사진 목록, 내 게시물 목록, 좋아하는 게시물 목록 처럼 사진만 나오는 경우 따로 api를 구현해야 할까?
# 일단 내 사진 목록에서 보여줄 용도로 하나 만들어보겠음


@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def myImgs(request):
    images = Menu.objects.order_by('-pk').filter(user=request.user)
    my_imgs = []
    for image in images:
        my_imgs.append(MenuSerializer(image).data)
    return Response(my_imgs)


def getImage(request, uri):
    images = []
    data = open('media/image/' + uri, "rb").read()
    images.append(data)
    return HttpResponse(images, content_type="image/png")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getChart(request, date):
    Menus = Menu.objects.filter(user=request.user, created_at__contains=date)
    Send = {'TotalCal': 0, 'Menus': {
        '아침': {}, '점심': {}, '저녁': {}, '간식': {}, '야식': {}, }}
    # Send = {'TotalCal' : 0, }
    # '아침': {meal:[menu2food_1, menu2food_2], nutrient: [탄,단,지]}
    time = ['아침', '점심', '저녁', '간식', '야식']
    for menu in Menus:
        print(menu)
        for t in time:
            if menu.mealTime == t:
                print(menu.id)
                menu2foods = Menu2food.objects.filter(image=menu)
                if 'meal' not in Send['Menus'][t]:
                    Send['Menus'][t]['meal'] = []
                T, D, G = 0, 0, 0
                for menu2food in menu2foods:
                    print(menu2food.food.DESC_KOR)
                    Send['Menus'][t]['meal'].append(
                        [menu2food.food.DESC_KOR, float(menu2food.food.NUTR_CONT1)*menu2food.value, menu2food.id, menu2food.value])
                    if menu2food.food.NUTR_CONT2:
                        T += float(menu2food.food.NUTR_CONT2)*menu2food.value
                    if menu2food.food.NUTR_CONT3:
                        D += float(menu2food.food.NUTR_CONT3)*menu2food.value
                    if menu2food.food.NUTR_CONT4:
                        G += float(menu2food.food.NUTR_CONT4)*menu2food.value
                    Send['TotalCal'] += int(menu2food.food.NUTR_CONT1) * \
                        menu2food.value
                total = T+D+G
                Send['Menus'][t]['nutrient'] = [
                    (T/total)*100, (D/total)*100, (G/total)*100]
    return Response(Send)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def plusCnt(request):
    menu2food_id = request.data['menu2food_id']
    menu2food = get_object_or_404(
        Menu2food, id=menu2food_id)
    menu2food.value += 1
    menu2food.save()
    return Response('늘렸다')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def minusCnt(request):
    menu2food_id = request.data['menu2food_id']
    menu2food = get_object_or_404(
        Menu2food, id=menu2food_id)
    menu2food.value -= 1
    menu2food.save()
    return Response('줄었다')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deleteMenu(request):
    menu2food_id = request.data['menu2food_id']
    del_Menu = get_object_or_404(
        Menu2food, id=menu2food_id)
    del_Menu.delete()
    return Response("식단이 삭제되었습니다.")


@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def getCalendar(request):
    Menus = Menu.objects.filter(user=request.user)
    MenusDict = {}
    for i in range(len(Menus)):
        print(Menus[i].mealTime)
        created_at = str(Menus[i].created_at)
        if created_at.split()[0] not in MenusDict.keys():
            # 아침, 점심, 저녁, 간식, 야식, 총칼로리
            MenusDict[created_at.split()[0]] = [0, 0, 0, 0, 0, 0]
        if Menus[i].mealTime == '아침':
            MenusDict[created_at.split()[0]][0] += float(Menus[i].totalCal)
        elif Menus[i].mealTime == '점심':
            MenusDict[created_at.split()[0]][1] += float(Menus[i].totalCal)
        elif Menus[i].mealTime == '저녁':
            MenusDict[created_at.split()[0]][2] += float(Menus[i].totalCal)
        elif Menus[i].mealTime == '간식':
            MenusDict[created_at.split()[0]][3] += float(Menus[i].totalCal)
        elif Menus[i].mealTime == '야식':
            MenusDict[created_at.split()[0]][4] += float(Menus[i].totalCal)
        else:
            MenusDict[created_at.split()[0]][5] += float(Menus[i].totalCal)
    return Response(MenusDict)
