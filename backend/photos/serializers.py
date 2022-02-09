from rest_framework import serializers

from .models import Photos, Gallery


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = "__all__"


class PhotosSerializer(serializers.ModelSerializer):
    images = GallerySerializer(many=True, required=False)

    def create(self, validated_data):
        data = validated_data.copy()

        images_data = self.context.get("request").FILES.getlist("images")

        try:
            photobook = Photos.objects.create(**data)
        except TypeError:
            msg = "Got a `TypeError` when calling `PhotoBook.objects.create()`."
            raise TypeError(msg)
        try:
            for image_data in images_data:
                image, created = Gallery.objects.get_or_create(image=image_data)
                photobook.images.add(image)

            return photobook
        except TypeError:
            photobook = Photos.objects.get(pk=photobook.id)
            photobook.delete()
            msg = "Got a `TypeError` when calling `Image.objects.get_or_create()`."
            raise TypeError(msg)

        return photobook

    class Meta:
        model = Photos
        fields = "__all__"
