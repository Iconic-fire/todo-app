from django.shortcuts import render
from .models import Todo
from django.core.serializers.json import DjangoJSONEncoder
import json

def todo_list(request):
    todos = Todo.objects.all()
    serialized_todos = json.loads(
        json.dumps(list(todos.values()), cls=DjangoJSONEncoder)
    )
    template_dir = "todo/"
    template_name = "index.html"

    return render(
        request=request,
        template_name=template_dir + template_name,
        context={
            "title": "Todo List",
            "todos_context": {
                "todos": serialized_todos,
                "total": len(serialized_todos),
            },
        },
    )
