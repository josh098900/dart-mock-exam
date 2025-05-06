document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const modeSelectionContainer = document.getElementById('mode-selection');
    const examArea = document.getElementById('exam-area');
    const examContainer = document.getElementById('exam-container');
    const submitButton = document.getElementById('submit-btn');
    const resultsContainer = document.getElementById('results-container');
    const scoreDisplay = document.getElementById('score');
    const feedbackArea = document.getElementById('feedback-area');
    const timerDisplay = document.getElementById('time');
    const restartButton = document.getElementById('restart-btn');
    const currentDateDisplay = document.getElementById('current-date');

    // Mode buttons
    const mainMockButton = document.getElementById('mode-main-mock');
    const codeSnippetsButton = document.getElementById('mode-code-snippets');
    const conceptualButton = document.getElementById('mode-conceptual');

    // --- Exam State ---
    let allQuestions = [];
    let currentQuestions = [];
    let timerInterval;
    let timeLeft = 0; // seconds

    // --- Set Current Date ---
    const today = new Date();
    if (currentDateDisplay) {
        currentDateDisplay.textContent = today.toLocaleDateString('en-GB', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // --- Helper Function to Escape HTML ---
    function escapeHTML(unsafeText) {
        if (typeof unsafeText !== 'string') {
            // If it's not a string, return it as is or an empty string,
            // depending on how you want to handle non-string data.
            return unsafeText === null || typeof unsafeText === 'undefined' ? '' : String(unsafeText);
        }
        return unsafeText
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // --- ALL QUESTIONS DEFINITION ---
    allQuestions = [
        // --- Worksheet 15 – Getting Started; Data Types ---
        {
            id: 'q1_static_typing',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "Which statement best describes Dart's type system?",
            options: [
                { text: "Dart is dynamically typed, similar to Python, checking types only at runtime.", correct: false },
                { text: "Dart is statically typed, allowing type checking at compile-time, which helps catch errors early.", correct: true },
                { text: "Dart does not have a type system; variables can hold any type of data without checks.", correct: false },
                { text: "Dart's type system is optional and primarily used for documentation.", correct: false }
            ],
            explanation: "Dart is a statically-typed language. This means variable types are checked at compile-time, which helps in identifying type-related errors before the code is run. (Worksheet 15: Static vs Dynamic Typing)"
        },
        {
            id: 'q2_string_interpolation',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "How would you correctly embed the result of `items.length` (where `items` is a List) inside a string in Dart?",
            options: [
                { text: "`'Total items: $items.length'`", correct: false },
                { text: "`'Total items: ${items.length}'`", correct: true },
                { text: "`'Total items: $(items.length)'`", correct: false },
                { text: "`'Total items: &items.length'`", correct: false }
            ],
            explanation: "For expressions more complex than a simple variable, you need to use `${expression}` for string interpolation in Dart. `items.length` is an expression. (Worksheet 15: String Interpolation)"
        },
        {
            id: 'q3_pow_return',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "What is the return type of the `pow()` function from `dart:math`?",
            options: [
                { text: "Always `int`", correct: false },
                { text: "Always `double`", correct: false },
                { text: "`num`, which can be an `int` or a `double`", correct: true },
                { text: "`String`, representing the number", correct: false }
            ],
            explanation: "The `pow()` function in Dart returns a `num`, which is a superclass of both `int` and `double`. The actual runtime type depends on the inputs and whether the result has a fractional part. (Worksheet 15: Return Type of pow())"
        },
        {
            id: 'q13_type_conversion_error',
            type: 'code-snippet',
            category: 'code',
            text: "What happens when the following Dart code is executed?",
            code:
`void main() {
  try {
    String value = "hello";
    int number = int.parse(value);
    print("Number: \$number");
  } catch (e) {
    print("Error: Could not parse.");
  }
}`,
            options: [
                { text: "Prints: Number: followed by a random integer", correct: false },
                { text: "Prints: Error: Could not parse.", correct: true },
                { text: "The program crashes without printing anything.", correct: false },
                { text: "Prints: Number: null", correct: false }
            ],
            explanation: "`int.parse()` will throw a `FormatException` if the string is not a valid representation of an integer. 'hello' is not a valid integer, so the catch block is executed. (Worksheet 15: Type Conversion)"
        },
        {
            id: 'q4_arrow_function',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "When can you use an arrow function (`=>`) in Dart?",
            options: [
                { text: "For any function, regardless of its complexity.", correct: false },
                { text: "Only for functions that contain a single expression.", correct: true },
                { text: "Only for functions that do not take any parameters.", correct: false },
                { text: "Only for functions that include `if/else` statements.", correct: false }
            ],
            explanation: "Arrow functions (`=>`) in Dart are a shorthand syntax for functions that contain only a single expression. They cannot be used for functions with multiple statements, `if` conditions, `try-catch` blocks, etc. (Worksheet 16: Arrow Function Limitations)"
        },
        {
            id: 'q5_named_params',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "How do you define a function `greet` that takes a required named parameter `name` (String) and an optional named parameter `age` (int) with a default value of 30?",
            options: [
                { text: "`void greet({String name, int age = 30}) {}`", correct: false },
                { text: "`void greet({required String name, int age = 30}) {}`", correct: true },
                { text: "`void greet(required String name, [int age = 30]) {}`", correct: false },
                { text: "`void greet({String name = required, int age = 30}) {}`", correct: false }
            ],
            explanation: "Named parameters are enclosed in `{}`. `required` keyword marks a named parameter as mandatory. Default values are assigned using `=`. (Worksheet 16: Named Parameters)"
        },
        {
            id: 'q6_dowhile_loop',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "What is a key characteristic of a `do-while` loop?",
            options: [
                { text: "It checks the condition before the first iteration.", correct: false },
                { text: "It always executes the loop body at least once.", correct: true },
                { text: "It cannot use a `break` statement.", correct: false },
                { text: "It is identical to a `while` loop.", correct: false }
            ],
            explanation: "A `do-while` loop executes its body first, and then checks the condition. This guarantees at least one execution. (Worksheet 16: Loop Execution and Flow Control)"
        },
        {
            id: 'q14_switch_nullable_bool',
            type: 'code-snippet',
            category: 'code',
            text: "What will be printed by the following Dart code if `isReady` is `null`?",
            code:
`void checkStatus(bool? isReady) {
  String message;
  switch (isReady) {
    case true:
      message = "Ready!";
      break;
    case false:
      message = "Not ready.";
      break;
    case null:
      message = "Status unknown.";
      break;
  }
  print(message);
}

void main() {
  checkStatus(null);
}`,
            options: [
                { text: "Ready!", correct: false },
                { text: "Not ready.", correct: false },
                { text: "Status unknown.", correct: true },
                { text: "An error will occur due to missing default.", correct: false }
            ],
            explanation: "When switching on a nullable type like `bool?`, you must handle `true`, `false`, and `null`, or provide a `default` case. Here, `null` is explicitly handled. (Worksheet 16: Switch Statements with Nullable Values)"
        },
        {
            id: 'q15_cmd_args',
            type: 'code-snippet',
            category: 'code',
            text: "If a Dart program `my_app.dart` is run with `dart my_app.dart hello 42`, what is `args[1]` inside `main(List<String> args)`?",
            code:
`void main(List<String> args) {
  if (args.length > 1) {
    print(args[1]);
  } else {
    print("Not enough arguments");
  }
}`,
            options: [
                { text: "`'hello'`", correct: false },
                { text: "`'42'`", correct: true },
                { text: "`42` (as an int)", correct: false },
                { text: "An error occurs due to type mismatch.", correct: false }
            ],
            explanation: "Command-line arguments are passed as a list of strings. `args[0]` would be 'hello', and `args[1]` would be '42' (as a String). (Worksheet 16: Command-Line Arguments)"
        },
        {
            id: 'q7_string_indexOf',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "What does the `indexOf()` method of a String return if the substring is not found?",
            options: [
                { text: "`0`", correct: false },
                { text: "`-1`", correct: true },
                { text: "`null`", correct: false },
                { text: "An empty string `''`", correct: false }
            ],
            explanation: "The `indexOf()` method returns the starting index of the first occurrence of a substring. If the substring is not found, it returns -1. (Worksheet 17: String Search (indexOf))"
        },
        {
            id: 'q8_set_duplicates',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "Which Dart collection type automatically ensures that it does not contain duplicate elements?",
            options: [
                { text: "`List`", correct: false },
                { text: "`Map` (for its values)", correct: false },
                { text: "`Set`", correct: true },
                { text: "`String`", correct: false }
            ],
            explanation: "A `Set` in Dart is an unordered collection of unique items. It does not allow duplicate elements. (Worksheet 17: Duplicates in Collections, Set Uniqueness)"
        },
        {
            id: 'q9_example_map_access',
            type: 'code-snippet',
            category: 'code',
            text: "What does the following Dart function print? Select the correct answer.",
            code:
`void checkProduct() {
  Map<String, double> prices = {
    'Bread': 1.5,
    'Milk': 1.0,
    'Eggs': 2.0,
  };
  if (prices.containsKey('Egg')) { // Note: 'Egg' vs 'Eggs'
    print('Eggs cost £\${prices['Eggs']}');
  } else {
    print('Product not found or key mismatch.');
  }
}

void main() {
  checkProduct();
}`,
            options: [
                { text: "Eggs cost £null", correct: false },
                { text: "Eggs cost £2.0", correct: false },
                { text: "Product not found or key mismatch.", correct: true },
                { text: "An error occurs", correct: false }
            ],
            explanation: "The `containsKey` method is case-sensitive. The map contains 'Eggs', but it checks for 'Egg'. The `else` block will be executed. (Worksheet 17: Accessing Map Values)"
        },
         {
            id: 'q12_collection_true_statements',
            type: 'multiple-select',
            category: 'conceptual',
            text: "Select all the true statements about Strings, Lists, Sets, and Maps in Dart:",
            options: [
                { text: "The elements inside lists can be modified at runtime.", correct: true, id: 'q12_opt1_v2' },
                { text: "Given `Map emojis = {1: '😎'}`, `emojis[1] = '😍'` updates the value for key 1.", correct: true, id: 'q12_opt2_v2' },
                { text: "`List<dynamic> list = [1, 'two', 3.0];` is a valid declaration.", correct: true, id: 'q12_opt3_v2' },
                { text: "The `remove` method of a `List` removes only the first occurrence of the specified element.", correct: true, id: 'q12_opt4_v2' },
                { text: "`LinkedHashSet` preserves the insertion order of elements.", correct: true, id: 'q12_opt5_v2' },
                { text: "Map keys must be unique, but values can be duplicates.", correct: true, id: 'q12_opt6_v2' }
            ],
            correctAnswers: ['q12_opt1_v2', 'q12_opt2_v2', 'q12_opt3_v2', 'q12_opt4_v2', 'q12_opt5_v2', 'q12_opt6_v2'],
            explanation: "1. True: Lists are mutable. 2. True: Assigning to an existing key updates it. 3. True: `List<dynamic>` or `List<Object>` can hold mixed types. 4. True: `List.remove()` targets the first match. 5. True: `LinkedHashSet` (often the default `Set` implementation) maintains insertion order. 6. True: Map keys are unique; values can repeat. (Worksheet 17)"
        },
        {
            id: 'q16_list_modification',
            type: 'code-snippet',
            category: 'code',
            text: "What is the content of `numbers` after this code executes?",
            code:
`void main() {
  List<int> numbers = [10, 20, 30, 40, 50];
  numbers.remove(30);
  numbers.insert(1, 25);
  numbers.add(60);
  print(numbers);
}`,
            options: [
                { text: "`[10, 25, 20, 40, 50, 60]`", correct: true },
                { text: "`[10, 20, 25, 40, 50, 60]`", correct: false },
                { text: "`[10, 25, 30, 40, 50, 60]`", correct: false },
                { text: "`[25, 10, 20, 40, 50, 60]`", correct: false }
            ],
            explanation: "Initial: `[10, 20, 30, 40, 50]`\n1. `numbers.remove(30)` -> `[10, 20, 40, 50]`\n2. `numbers.insert(1, 25)` -> `[10, 25, 20, 40, 50]` (25 inserted at index 1)\n3. `numbers.add(60)` -> `[10, 25, 20, 40, 50, 60]`\n(Worksheet 17: List Modification)"
        },
        {
            id: 'q17_set_modification_iteration',
            type: 'code-snippet',
            category: 'code',
            text: "What will be printed by this Dart code?",
            code:
`import 'dart:collection'; // For LinkedHashSet if explicit

void main() {
  Set<String> fruits = LinkedHashSet.from({'apple', 'banana'}); // Guarantees order
  fruits.add('orange');
  fruits.remove('banana');
  fruits.add('apple'); // Ignored, already present

  for (var fruit in fruits) {
    print(fruit);
  }
}`,
            options: [
                { text: "apple\norange\nbanana", correct: false },
                { text: "apple\norange", correct: true },
                { text: "orange\napple", correct: false },
                { text: "banana\napple\norange", correct: false }
            ],
            explanation: "Initial: `{'apple', 'banana'}`. Add 'orange': `{'apple', 'banana', 'orange'}`. Remove 'banana': `{'apple', 'orange'}`. Add 'apple' (duplicate): `{'apple', 'orange'}`. `LinkedHashSet` iterates in insertion order of unique elements. (Worksheet 17: Set Uniqueness, Modifying a Set)"
        },
        {
            id: 'q10_private_members',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "How are private members (variables or methods) typically denoted in a Dart class to restrict their access to the defining library?",
            options: [
                { text: "Using the `private` keyword.", correct: false },
                { text: "By prefixing the member name with an underscore (`_`).", correct: true },
                { text: "By prefixing the member name with a hash (`#`).", correct: false },
                { text: "By not declaring them in the class constructor.", correct: false }
            ],
            explanation: "In Dart, members whose names begin with an underscore (`_`) are private to their library. (Worksheet 18: Private Members)"
        },
        {
            id: 'q11_inheritance_super',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "In Dart OOP, what is the primary purpose of the `super` keyword in a subclass constructor?",
            options: [
                { text: "To create an instance of the superclass.", correct: false },
                { text: "To call the constructor of the superclass.", correct: true },
                { text: "To access private members of the superclass.", correct: false },
                { text: "To declare that the class is a superclass.", correct: false }
            ],
            explanation: "The `super()` call in a subclass constructor is used to invoke a constructor of its direct superclass. (Worksheet 18: Inheritance and Subclassing)"
        },
        {
            id: 'q18_getter_setter',
            type: 'code-snippet',
            category: 'code',
            text: "What will be printed by the following code?",
            code:
`class User {
  String _name;
  User(this._name);

  String get name => _name.toUpperCase();
  set name(String newName) {
    if (newName.length > 2) {
      _name = newName;
    }
  }
}

void main() {
  var user = User("Bob");
  print(user.name);
  user.name = "Al";
  print(user.name);
  user.name = "Alice";
  print(user.name);
}`,
            options: [
                { text: "BOB\nAL\nALICE", correct: false },
                { text: "BOB\nBOB\nALICE", correct: true },
                { text: "Bob\nAl\nAlice", correct: false },
                { text: "Bob\nBob\nAlice", correct: false }
            ],
            explanation: "1. `user.name` (getter): 'BOB'.\n2. `user.name = 'Al'`: Setter called, `'Al'.length` (2) is not `> 2`, so `_name` remains 'Bob'.\n3. `user.name` (getter): 'BOB'.\n4. `user.name = 'Alice'`: Setter called, `'Alice'.length` (5) is `> 2`, so `_name` becomes 'Alice'.\n5. `user.name` (getter): 'ALICE'.\n(Worksheet 18: Getters and Setters)"
        },
        {
            id: 'q19_composition',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "Which scenario best describes 'composition' in OOP?",
            options: [
                { text: "A `SportsCar` class extending a `Car` class.", correct: false },
                { text: "A `University` class having a list of `Department` objects.", correct: true },
                { text: "A `Shape` class with a method `draw()` that is implemented differently by `Circle` and `Square`.", correct: false },
                { text: "Making a class member private using an underscore.", correct: false }
            ],
            explanation: "Composition is a 'has-a' relationship. A University 'has-a' list of Departments. Extending a class (SportsCar 'is-a' Car) is inheritance. Differing implementations of `draw()` is polymorphism. Underscore is for privacy. (Worksheet 18: Composition)"
        },
        {
            id: 'q20_inheritance_tostring',
            type: 'code-snippet',
            category: 'code',
            text: "What is the output of this Dart program?",
            code:
`class Animal {
  String name;
  Animal(this.name);

  @override
  String toString() {
    return "Animal[\$name]";
  }
}

class Dog extends Animal {
  String breed;
  Dog(String name, this.breed) : super(name);

  @override
  String toString() {
    return "Dog[\$name, Breed: \$breed, Super: \${super.toString()}]";
  }
}

void main() {
  Dog myDog = Dog("Buddy", "Golden Retriever");
  print(myDog);
}`,
            options: [
                { text: "Dog[Buddy, Breed: Golden Retriever]", correct: false },
                { text: "Dog[Buddy, Breed: Golden Retriever, Super: Animal[Buddy]]", correct: true },
                { text: "Animal[Buddy]", correct: false },
                { text: "An error occurs due to super.toString() call.", correct: false }
            ],
            explanation: "The `Dog` class overrides `toString()`. Inside its `toString()`, `super.toString()` correctly calls the `Animal` class's `toString()` method. (Worksheet 18: Inheritance and Subclassing, overriding toString())"
        },
        {
            id: 'q21_breakpoints',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "What is the primary purpose of using a breakpoint when debugging code?",
            options: [
                { text: "To automatically fix errors in the code.", correct: false },
                { text: "To pause program execution at a specific point to inspect variables and flow.", correct: true },
                { text: "To speed up the execution of the program.", correct: false },
                { text: "To add comments to the code for better readability.", correct: false }
            ],
            explanation: "Breakpoints allow developers to pause code execution at a chosen line, inspect the current state of variables, and step through the code line by line to understand its behavior and diagnose bugs. (General Programming Knowledge: Breakpoints and Debugging)"
        },
        {
            id: 'q22_event_driven_vs_procedural',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "Which of these best describes an event-driven programming paradigm?",
            options: [
                { text: "The program executes a sequence of instructions in a predefined order from start to finish.", correct: false },
                { text: "The program's flow is determined by user actions (like clicks, key presses) or system events.", correct: true },
                { text: "The program focuses on breaking down tasks into reusable functions or procedures.", correct: false },
                { text: "The program primarily uses classes and objects to structure data and behavior.", correct: false }
            ],
            explanation: "Event-driven programming is characterized by its responsiveness to events. Procedural programming follows a fixed sequence. (General Programming Knowledge: Event-Driven vs Procedural Programming)"
        },
        {
            id: 'q23_dart_compiled_feature',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "Dart is a compiled language. What is a key advantage of this?",
            options: [
                { text: "Code can be modified directly at runtime without recompilation.", correct: false },
                { text: "Compilation to native machine code can result in faster execution performance.", correct: true },
                { text: "It requires an interpreter to be present on the user's system.", correct: false },
                { text: "Type errors are only caught when the specific line of code is executed.", correct: false }
            ],
            explanation: "Compiled languages like Dart translate the entire program into machine code (or an intermediate language like JavaScript for web) before execution. This often leads to better performance compared to interpreted languages. Static typing, also a Dart feature, helps catch type errors at compile time. (Worksheet 15: Compiled vs Interpreted Languages)"
        },
         {
            id: 'q24_try_on_catch_finally',
            type: 'code-snippet',
            category: 'code',
            text: "What is the output of the following Dart code?",
            code:
`void processValue(dynamic val) {
  try {
    print("1. Trying to process...");
    if (val is String) {
      throw FormatException("String not allowed");
    }
    int result = 100 ~/ val; // Integer division
    print("2. Result: \$result");
  } on FormatException catch (e) {
    print("3. Handled FormatException: \${e.message}");
  } catch (e) {
    print("4. Generic catch: \$e");
  } finally {
    print("5. Finally block executed.");
  }
}

void main() {
  processValue(0); // Causes DivisionByZeroException
  processValue("text"); // Causes FormatException
}`,
            options: [
                { text: "1. Trying...\n4. Generic catch...\n5. Finally...\n1. Trying...\n3. Handled FormatException...\n5. Finally...", correct: true },
                { text: "1. Trying...\n2. Result...\n5. Finally...\n1. Trying...\n3. Handled FormatException...\n5. Finally...", correct: false },
                { text: "1. Trying...\n4. Generic catch...\n1. Trying...\n3. Handled FormatException...", correct: false },
                { text: "Error for both, no finally block.", correct: false }
            ],
            explanation: "For `processValue(0)`: 1. Prints. Integer division by zero throws an `IntegerDivisionByZeroException`. This is caught by the generic `catch (e)`. 4. Prints. Then 5. Prints.\nFor `processValue(\"text\")`: 1. Prints. `throw FormatException` is executed. This is caught by `on FormatException`. 3. Prints. Then 5. Prints.\nThe `finally` block always executes. (Worksheet 16: try-catch Error Handling)"
        },
        {
            id: 'q25_map_iteration_entries',
            type: 'code-snippet',
            category: 'code',
            text: "How can you iterate over a map and access both keys and values simultaneously in Dart?",
            code:
`void main() {
  Map<String, int> ages = {'Alice': 30, 'Bob': 25};
  // Which loop structure correctly prints "Key: <key>, Value: <value>"?

  // Option A:
  // for (var key in ages.keys) { print("Key: \$key, Value: \${ages[key]}"); }

  // Option B:
  // for (var entry in ages.entries) { print("Key: \${entry.key}, Value: \${entry.value}"); }

  // Option C:
  // ages.forEach((key, value) => print("Key: \$key, Value: \$value"));
}`,
            options: [
                { text: "Only Option A", correct: false },
                { text: "Only Option B", correct: false },
                { text: "Only Option C", correct: false },
                { text: "All options A, B, and C are valid ways.", correct: true }
            ],
            explanation: "All three methods are valid ways to iterate through a map and access its keys and values:\nA. Iterates keys and uses the key to look up the value.\nB. Iterates `MapEntry` objects, directly providing `entry.key` and `entry.value` (most efficient for simultaneous access).\nC. Uses the `forEach` method specific to Maps.\n(Worksheet 17: Accessing Map Values)"
        }
    ];
    console.log('Initial allQuestions defined. Length:', allQuestions.length);


    // --- Helper Functions ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer(duration) {
        timeLeft = duration;
        if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if (timerDisplay) timerDisplay.textContent = "Time's Up!";
                if (submitButton) submitButton.disabled = true;
                alert("Time's up! Your answers (if any) will be processed.");
                handleSubmit();
            }
        }, 1000);
    }

    function renderQuestions() {
        if (!examContainer) {
            console.error("renderQuestions: examContainer is null!");
            return;
        }
        console.log('renderQuestions called. Expected number of questions:', currentQuestions.length);
        examContainer.innerHTML = ''; // Clear previous questions
        let questionHTML = '';
        try { // Add try-catch around HTML generation
            currentQuestions.forEach((q, index) => {
                questionHTML += `<div class="question-card" id="question-${index}">`;
                questionHTML += `<p class="question-number">Question ${index + 1} of ${currentQuestions.length}</p>`;
                questionHTML += `<p class="question-text">${escapeHTML(q.text)}</p>`; // Escaped

                if (q.code) {
                    // Escape &, <, > for code to be displayed as text in <pre><code>
                    const escapedCode = q.code ? escapeHTML(q.code) : '';
                    questionHTML += `<pre class="code-block"><code>${escapedCode}</code></pre>`;
                }

                questionHTML += `<div class="options-container">`;
                if (q.options && (q.type === 'multiple-choice' || q.type === 'code-snippet')) {
                    q.options.forEach((opt) => {
                        questionHTML += `
                            <label>
                                <input type="radio" name="question${q.id}" value="${escapeHTML(opt.text)}"> 
                                ${escapeHTML(opt.text)}
                            </label>`; // Escaped opt.text for value and display
                    });
                } else if (q.options && q.type === 'multiple-select') {
                    q.options.forEach((opt) => {
                        questionHTML += `
                            <label>
                                <input type="checkbox" name="question${q.id}" value="${escapeHTML(opt.text)}" data-option-id="${opt.id}">
                                ${escapeHTML(opt.text)}
                            </label>`; // Escaped opt.text for value and display
                    });
                }
                questionHTML += `</div>`;
                questionHTML += `<div class="explanation" style="display:none;"><p><strong>Explanation:</strong> ${escapeHTML(q.explanation)}</p></div>`; // Escaped
                questionHTML += `</div>`;
            });
        } catch (error) {
            console.error("Error during HTML generation in renderQuestions:", error);
            // Display a partial list if something went wrong, or an error message
            questionHTML += "<p style='color:red;'>An error occurred while rendering some questions.</p>";
        }
        examContainer.innerHTML = questionHTML;
    }


    function handleSubmit() {
        clearInterval(timerInterval);
        let score = 0;
        let detailedFeedbackHTML = '';

        currentQuestions.forEach((q, index) => {
            const questionCard = document.getElementById(`question-${index}`);
            detailedFeedbackHTML += `<div class="feedback-item">`;
            detailedFeedbackHTML += `<p><strong>Question ${index + 1}:</strong> ${escapeHTML(q.text)}</p>`; // Escaped
            if (q.code) {
                 const escapedCode = q.code ? escapeHTML(q.code) : '';
                 detailedFeedbackHTML += `<pre class="code-block"><code>${escapedCode}</code></pre>`;
            }

            let correct = false;
            let userAnswerHTML = 'Your answer: ';
            let answered = false;

            if (q.type === 'multiple-choice' || q.type === 'code-snippet') {
                const selectedOptionInput = document.querySelector(`input[name="question${q.id}"]:checked`);
                if (selectedOptionInput) {
                    answered = true;
                    // User's answer is the 'value' attribute, which we now escape for safety
                    // but comparison should be against the original unescaped opt.text if possible,
                    // or ensure consistent escaping if values are also escaped.
                    // For simplicity, we'll compare escaped value if that's what we store,
                    // or assume opt.text in q.options is the canonical unescaped value.
                    // Let's assume selectedOptionInput.value is the (now potentially escaped) text.
                    // The original logic compared selectedOption.value with opt.text.
                    // If selectedOption.value is now escaped, this comparison might fail.
                    // The value of radio/checkbox should be a simple identifier or index if text is complex.
                    // For now, let's re-evaluate: the value attribute of the input should be the raw text.
                    // The display text next to it is escaped. So selectedOptionInput.value is raw.
                    const userAnswer = selectedOptionInput.value; // This should be the raw option text
                    userAnswerHTML += escapeHTML(userAnswer); // Escape for display in feedback

                    const correctOption = q.options.find(opt => opt.correct === true);
                    if (correctOption && userAnswer === correctOption.text) { // Compare raw userAnswer with raw correctOption.text
                        score++;
                        correct = true;
                    }
                } else {
                    userAnswerHTML += "No answer selected.";
                }
                const correctOptionData = q.options.find(opt => opt.correct);
                detailedFeedbackHTML += `<p>${userAnswerHTML}</p>`;
                if (correctOptionData) {
                    detailedFeedbackHTML += `<p>Correct answer: ${escapeHTML(correctOptionData.text)}</p>`; // Escaped
                }


            } else if (q.type === 'multiple-select') {
                const selectedCheckboxes = document.querySelectorAll(`input[name="question${q.id}"]:checked`);
                let selectedIds = [];
                let selectedTexts = []; // Raw texts
                if (selectedCheckboxes.length > 0) answered = true;

                selectedCheckboxes.forEach(cb => {
                    selectedIds.push(cb.dataset.optionId);
                    selectedTexts.push(cb.value); // cb.value is raw text
                });

                userAnswerHTML += selectedTexts.length > 0 ? selectedTexts.map(t => escapeHTML(t)).join(', ') : "No answer selected."; // Escape for display
                detailedFeedbackHTML += `<p>${userAnswerHTML}</p>`;

                const correctOptionIds = q.correctAnswers || [];
                let isFullyCorrect = answered && selectedIds.length === correctOptionIds.length &&
                                   correctOptionIds.every(id => selectedIds.includes(id));

                if (isFullyCorrect) {
                    score++;
                    correct = true;
                }
                const correctOptionsDisplayTexts = q.options
                    .filter(opt => correctOptionIds.includes(opt.id))
                    .map(opt => escapeHTML(opt.text)) // Escape for display
                    .join(', ');
                detailedFeedbackHTML += `<p>Correct answer(s): ${correctOptionsDisplayTexts}</p>`;
            }

            if (questionCard) {
                if (correct) {
                    questionCard.classList.add('correct');
                    detailedFeedbackHTML += `<p class="feedback-status correct-feedback">You got it right!</p>`;
                } else if (answered) {
                    questionCard.classList.add('incorrect');
                    detailedFeedbackHTML += `<p class="feedback-status incorrect-feedback">This was incorrect.</p>`;
                } else {
                    questionCard.classList.add('unanswered');
                    detailedFeedbackHTML += `<p class="feedback-status unanswered-feedback">Not answered.</p>`;
                }
                const explanationDiv = questionCard.querySelector('.explanation');
                if (explanationDiv) {
                    explanationDiv.style.display = 'block';
                }
            }
            detailedFeedbackHTML += `<p class="explanation-text"><em>Explanation: ${escapeHTML(q.explanation)}</em></p>`; // Escaped
            detailedFeedbackHTML += `</div><hr class="feedback-divider">`;
        });

        if(scoreDisplay) scoreDisplay.textContent = `${score} out of ${currentQuestions.length}`;
        if(feedbackArea) feedbackArea.innerHTML = detailedFeedbackHTML; // HTML is already built with escaped content
        if(resultsContainer) resultsContainer.style.display = 'block';
        if(submitButton) submitButton.style.display = 'none';
        if(submitButton) submitButton.disabled = false;
        if(examContainer) examContainer.style.display = 'none';
    }

    function startExam(mode) {
        if (!modeSelectionContainer || !examArea || !resultsContainer || !examContainer || !submitButton) {
            console.error("One or more critical DOM elements are missing. Check HTML IDs and ensure elements exist.");
            return;
        }
        console.log('--- Starting Exam ---');
        console.log('Mode selected:', mode);
        console.log('Current allQuestions length at start of startExam:', allQuestions.length);

        modeSelectionContainer.style.display = 'none';
        examArea.style.display = 'block';
        resultsContainer.style.display = 'none';
        examContainer.style.display = 'block';
        submitButton.style.display = 'block';
        submitButton.disabled = false;

        let timePerQuestion = 90;

        if (mode === 'main') {
            currentQuestions = [...allQuestions];
            console.log('Mode: Main - Copied allQuestions. currentQuestions length:', currentQuestions.length);
            shuffleArray(currentQuestions);
            console.log('Mode: Main - After shuffle. currentQuestions length:', currentQuestions.length);
            if (currentQuestions.length > 25 && allQuestions.length >= 25) {
                currentQuestions = currentQuestions.slice(0, 25);
                console.log('Mode: Main - Sliced to 25. currentQuestions length:', currentQuestions.length);
            }
        } else if (mode === 'code') {
            currentQuestions = allQuestions.filter(q => q.category === 'code');
            console.log('Mode: Code - After filter. currentQuestions length:', currentQuestions.length);
            if (currentQuestions.length > 0) {
                shuffleArray(currentQuestions);
                console.log('Mode: Code - After shuffle. currentQuestions length:', currentQuestions.length);
            }
        } else if (mode === 'conceptual') {
            currentQuestions = allQuestions.filter(q => q.category === 'conceptual');
            console.log('Mode: Conceptual - After filter. currentQuestions length:', currentQuestions.length);
            if (currentQuestions.length > 0) {
                shuffleArray(currentQuestions);
                console.log('Mode: Conceptual - After shuffle. currentQuestions length:', currentQuestions.length);
            }
        }
        console.log('Final currentQuestions length BEFORE calling renderQuestions:', currentQuestions.length);

        if (currentQuestions.length === 0) {
            if(examContainer) examContainer.innerHTML = "<p>No questions available for this mode. Please add more questions or check filters.</p>";
            if(submitButton) submitButton.style.display = 'none';
            clearInterval(timerInterval);
            if (timerDisplay) timerDisplay.textContent = "--:--";
            console.log('No questions to render for this mode.');
            return;
        }
        
        renderQuestions();
        startTimer(currentQuestions.length * timePerQuestion);
        console.log('--- Exam Started ---');
    }

    // --- Event Listeners ---
    if (mainMockButton) mainMockButton.addEventListener('click', () => startExam('main'));
    if (codeSnippetsButton) codeSnippetsButton.addEventListener('click', () => startExam('code'));
    if (conceptualButton) conceptualButton.addEventListener('click', () => startExam('conceptual'));
    if (submitButton) submitButton.addEventListener('click', handleSubmit);

    if (restartButton) {
        restartButton.addEventListener('click', () => {
            if (examArea) examArea.style.display = 'none';
            if (modeSelectionContainer) modeSelectionContainer.style.display = 'block';
            clearInterval(timerInterval);
            if (timerDisplay) timerDisplay.textContent = "--:--";
        });
    }
});