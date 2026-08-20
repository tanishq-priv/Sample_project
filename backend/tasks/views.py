from rest_framework import generics
from .models import Task
from .serializers import TaskSerializer

class TaskListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/tasks/     -> List all tasks
    POST /api/tasks/     -> Create a new task
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/tasks/<id>/  -> Retrieve task detail
    PUT    /api/tasks/<id>/  -> Update task (or toggle completed status)
    DELETE /api/tasks/<id>/  -> Delete task
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = 'pk'
