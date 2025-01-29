from datetime import timedelta

from django.utils import timezone
from django.test import TestCase

from core.models import Todo

class TestTodoModel(TestCase):
    """Test Todo Model"""

    def test_todo_creation(self) -> None:
        """Test todo model instance creation is working"""

        # initialize data
        title = "test-title"
        description = "test-description"
        due_date = timezone.now() + timedelta(days=1)

        # create todo instance
        todo = Todo.objects.create(
            title=title,
            description=description,
            is_completed=False,
            due_date=due_date,
        )

        # assert field values
        self.assertEqual(todo.title, title)
        self.assertEqual(todo.description, description)
        self.assertEqual(todo.is_completed, False)
        self.assertAlmostEqual(todo.created_at, todo.updated_at, delta=timedelta(milliseconds=10))

        # assert string representation
        self.assertEqual(str(todo), title)