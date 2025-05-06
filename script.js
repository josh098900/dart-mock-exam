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
    // !!! CRITICAL: VERIFY ALL 'correct: true' AND 'correctAnswers' VALUES BELOW !!!
    // --- ALL QUESTIONS DEFINITION ---
// !!! CRITICAL: VERIFY ALL 'correct: true' AND 'correctAnswers' VALUES AND EXPLANATIONS BELOW !!!
allQuestions = [
    // Worksheet 15 (Dart Basics)
    {
        id: 'ws15_dart_q0',
        type: 'multiple-select',
        category: 'conceptual',
        text: "Select all the correct statements about static compiled low-level programs, specifically, Dart:",
        options: [
            { text: "The data types are declared in statically typed languages to prevent common errors like values being out of the desired range.", correct: true, id: 'ws15_dart_q0_opt0' },
            { text: "The Dart SDK includes tools like a compiler, a debugger, the Dart shell and a package manager.", correct: true, id: 'ws15_dart_q0_opt1' },
            { text: "Every Dart file needs to have a `main` function.", correct: false, id: 'ws15_dart_q0_opt2' },
            { text: "The Dart compiler will throw an error if a value assigned to a variable does not match its declared type.", correct: true, id: 'ws15_dart_q0_opt3' },
            { text: "The reason `~/` is used for integer division in Dart instead of `//` is that the latter is reserved for in-line comments.", correct: true, id: 'ws15_dart_q0_opt4' },
            { text: "There is no need to use curly brackets (`{}`) in Dart when string interpolating values or variables.", correct: false, id: 'ws15_dart_q0_opt5' }
        ],
        correctAnswers: ['ws15_dart_q0_opt0', 'ws15_dart_q0_opt1', 'ws15_dart_q0_opt3', 'ws15_dart_q0_opt4'],
        explanation: "1. Static typing helps catch type errors early. While range is often a runtime concern, type systems can contribute to value correctness. 2. The Dart SDK provides a comprehensive toolset (compiler, debugger, `dart` CLI, `pub` package manager). 3. Only executable Dart programs require a `main()` entry point; libraries do not. 4. Dart's static type system enforces type compatibility at compile time. 5. `//` is indeed for single-line comments in Dart, and `~/` performs truncating (integer) division. 6. Curly braces are essential for interpolating expressions (`\${expression}`) and for disambiguating simple variables when followed by other text (`\${variable}text`)."
    },
    {
        id: 'ws15_dart_q1',
        type: 'multiple-select',
        category: 'conceptual',
        text: "What are the characteristics of interpreted languages? Select all that apply.",
        options: [
            { text: "They require an interpreter at runtime.", correct: true, id: 'ws15_dart_q1_opt0' },
            { text: "They are generally slower than compiled languages.", correct: true, id: 'ws15_dart_q1_opt1' },
            { text: "They cannot be used for cross-platform application development.", correct: false, id: 'ws15_dart_q1_opt2' },
            { text: "They are primarily used for scripting or high-level programming.", correct: true, id: 'ws15_dart_q1_opt3' },
            { text: "We cannot specify the data types of variables in interpreted code.", correct: false, id: 'ws15_dart_q1_opt4' }
        ],
        correctAnswers: ['ws15_dart_q1_opt0', 'ws15_dart_q1_opt1', 'ws15_dart_q1_opt3'],
        explanation: "Interpreted languages translate and execute code line-by-line at runtime using an interpreter. This process is generally slower than running pre-compiled machine code. They are very common for scripting and high-level tasks. Many interpreted languages (like Python, Ruby, JavaScript) are designed for and widely used in cross-platform development. While many interpreted languages are dynamically typed (types checked at runtime), it's not a universal rule that types cannot be specified (e.g., Python supports type hints, TypeScript is a typed superset of JavaScript)."
    },
    {
        id: 'ws15_dart_q2',
        type: 'multiple-select',
        category: 'conceptual',
        text: "Which of the following statements about compiled languages is true? Select all that apply.",
        options: [
            { text: "The “build” step to run a compiled language is faster than that of an interpreted language.", correct: false, id: 'ws15_dart_q2_opt0' },
            { text: "Scripts written in compiled languages are directly executed by the operating system, resulting in faster performance.", correct: true, id: 'ws15_dart_q2_opt1' },
            { text: "Compiled languages require a piece of software that translates and runs the code line by line.", correct: false, id: 'ws15_dart_q2_opt2' },
            { text: "Compiled languages are primarily used for building apps or graphical user interfaces.", correct: true, id: 'ws15_dart_q2_opt3' },
            { text: "Dart code can either be compiled to JavaScript code for the browser or an executable that can be run without an interpreter.", correct: true, id: 'ws15_dart_q2_opt4' }
        ],
        correctAnswers: ['ws15_dart_q2_opt1', 'ws15_dart_q2_opt3', 'ws15_dart_q2_opt4'],
        explanation: "Compiled languages translate source code into machine code (or an intermediate bytecode) before execution. This resulting machine code can be directly executed by the OS, generally leading to faster runtime performance. They are often preferred for performance-critical applications like system software or complex GUIs. Dart exemplifies this by compiling to native machine code for mobile/desktop (AOT) and to JavaScript for web deployment. The build/compilation step itself is an extra step that takes time, unlike interpreted languages. An interpreter translates and runs code line-by-line."
    },
    {
        id: 'ws15_dart_q3',
        type: 'multiple-select', // Changed to allow `var name = "Ayodeji";` if it were an option. Given current options, only one is declaration.
        category: 'conceptual',
        text: "Which of these is a valid way to declare a string variable in Dart? Select all that apply.",
        options: [
            { text: "`string name = \"Ayodeji\";`", correct: false, id: 'ws15_dart_q3_opt0' },
            { text: "`String name = 'Ayodeji';`", correct: true, id: 'ws15_dart_q3_opt1' },
            { text: "`var name = Ayodeji;`", correct: false, id: 'ws15_dart_q3_opt2' },
            { text: "`name = 'Ayodeji';`", correct: false, id: 'ws15_dart_q3_opt3' },
            { text: "`String name == \"Ayodeji\";`", correct: false, id: 'ws15_dart_q3_opt4' }
        ],
        correctAnswers: ['ws15_dart_q3_opt1'],
        explanation: "A valid way to declare an explicitly typed string variable is `String name = 'Ayodeji';` (or using double quotes). `var name = \"Ayodeji\";` would also be valid, with type inference. Option 1 uses lowercase `string` which is incorrect. Option 3 is missing quotes around `Ayodeji`, making it an identifier. Option 4 is an assignment, not a declaration (it's valid only if `name` was declared earlier). Option 5 is a comparison operation."
    },
    {
        id: 'ws15_dart_q4a',
        type: 'multiple-choice',
        category: 'code',
        text: "What is the output of the following Dart code? Select the correct answer.",
        code: "double price = 3.5;\nint amount = 2;\nprint('Total: \$\${price * amount}');",
        options: [
            { text: "`Total: $3.5 * 2`", correct: false },
            { text: "`Total: $7.0`", correct: true },
            { text: "`Total: 7.0`", correct: false },
            { text: "`Total: $7`", correct: false },
            { text: "`Total: 7`", correct: false },
            { text: "`Error`", correct: false }
        ],
        explanation: "The expression `price * amount` evaluates to `7.0`. In the string `'Total: \$\${price * amount}'`, the first `\$` escapes the dollar sign, printing it literally. The `\${price * amount}` part then interpolates the value `7.0`. So the output is `Total: $7.0`."
    },
    {
        id: 'ws15_dart_q4b',
        type: 'multiple-choice',
        category: 'code',
        text: "What will be the output of the following Dart code? Select the correct answer.",
        code: "int a = 9;\nint b = 2;\na ~/= b;\nb += a;\nprint(a * b);",
        options: [
            { text: "24", correct: true },
            { text: "2", correct: false },
            { text: "18", correct: false },
            { text: "20", correct: false },
            { text: "16", correct: false }
        ],
        explanation: "1. `a ~/= b;` is equivalent to `a = a ~/ b;`. So, `a = 9 ~/ 2;` (integer division), which sets `a` to `4`.\n2. `b += a;` is equivalent to `b = b + a;`. So, `b = 2 + 4;`, which sets `b` to `6`.\n3. `print(a * b);` will print `4 * 6`, which is `24`."
    },
    {
        id: 'ws15_dart_q5',
        type: 'multiple-select',
        category: 'code',
        text: "The type of the following functions has not been declared. Select all the correct options:",
        options: [
            { text: "`greet` returns a `double`:\n```dart\ngreet() {\n  var age = \"20\";\n  return double.parse(age);\n}```", code: "greet() {\n  var age = \"20\";\n  return double.parse(age);\n}", correct: true, id: 'ws15_dart_q5_opt0' },
            { text: "`getANumber` returns a `String`:\n```dart\nimport 'dart:io';\ngetANumber() {\n  print('Enter a number:');\n  var a = stdin.readLineSync();\n  return a;\n}```", code: "import 'dart:io';\ngetANumber() {\n  print('Enter a number:');\n  var a = stdin.readLineSync();\n  return a;\n}", correct: true, id: 'ws15_dart_q5_opt1' },
            { text: "`checkEven` returns a `bool`:\n```dart\nimport 'dart:io';\ncheckEven() {\n  print('Enter a number:');\n  int num = int.parse(stdin.readLineSync()!); \n  return num % 2 == 0;\n}```", code: "import 'dart:io';\ncheckEven() {\n  print('Enter a number:');\n  int num = int.parse(stdin.readLineSync()!); \n  return num % 2 == 0;\n}", correct: true, id: 'ws15_dart_q5_opt2' },
            { text: "`printName` returns a `String`:\n```dart\nimport 'dart:io';\nprintName() {\n  print('Enter your name:');\n  String? name = stdin.readLineSync();\n  print('Hello, \${name!.toUpperCase()}');\n}```", code: "import 'dart:io';\nprintName() {\n  print('Enter your name:');\n  String? name = stdin.readLineSync();\n  print('Hello, \${name!.toUpperCase()}');\n}", correct: false, id: 'ws15_dart_q5_opt3' },
            { text: "`divideNumbers` returns an `int`:\n```dart\ndivideNumbers() {\n  int a = 40;\n  int b = 8;\n  return a / b;\n}```", code: "divideNumbers() {\n  int a = 40;\n  int b = 8;\n  return a / b;\n}", correct: false, id: 'ws15_dart_q5_opt4' },
            { text: "`calculateSquareRoot` returns a `double`:\n```dart\nimport 'dart:math';\ncalculateSquareRoot() {\n  int num = 5;\n  return sqrt(num);\n}```", code: "import 'dart:math';\ncalculateSquareRoot() {\n  int num = 5;\n  return sqrt(num);\n}", correct: true, id: 'ws15_dart_q5_opt5' }
        ],
        correctAnswers: ['ws15_dart_q5_opt0', 'ws15_dart_q5_opt1', 'ws15_dart_q5_opt2', 'ws15_dart_q5_opt5'],
        explanation: "1. `double.parse()` returns `double`. 2. `stdin.readLineSync()` returns `String?` (a nullable String). 3. `num % 2 == 0` is a boolean expression. 4. `printName` has no `return` statement with a value, so it implicitly returns `void`. 5. The `/` operator in Dart performs double division, so it returns a `double`. 6. `sqrt()` from `dart:math` returns a `double`."
    },
    // Worksheet 16
    {
        id: 'ws16_dart_q0',
        type: 'multiple-select',
        category: 'conceptual',
        text: "Select all correct statements when it comes to Dart's functions and control flow:",
        options: [
            { text: "The `void` keyword is used to define functions that return no specific type of data.", correct: true, id: 'ws16_dart_q0_opt0' },
            { text: "`while` loops can only iterate a known number of times (this count must be known before runtime).", correct: false, id: 'ws16_dart_q0_opt1' },
            { text: "Dart's null safety feature helps prevent creating variables that can be `null`.", correct: false, id: 'ws16_dart_q0_opt2' },
            { text: "We can cover multiple cases at once in `switch` statement.", correct: true, id: 'ws16_dart_q0_opt3' },
            { text: "To make (a subset of) a function’s parameters into named parameters, it suffices to add curly brackets (`{}`) around them.", correct: true, id: 'ws16_dart_q0_opt4' }
        ],
        correctAnswers: ['ws16_dart_q0_opt0', 'ws16_dart_q0_opt3', 'ws16_dart_q0_opt4'],
        explanation: "1. `void` indicates a function doesn't return a value. 2. `while` loops iterate as long as their condition is true, which doesn't have to be a known number of times beforehand. 3. Null safety helps manage nullability with features like `?` and `!`, but doesn't prevent creating nullable variables. 4. Dart's switch statements support fall-through for empty cases and pattern matching (Dart 3+) can cover multiple conditions. 5. Encasing parameters in `{}` makes them named parameters."
    },
    {
        id: 'ws16_dart_q1',
        type: 'multiple-select',
        category: 'code',
        text: "Given the following function definition, select the correct answer.", // "Correct answer" implies which statements are true about calls.
        code: "void greet(String? name) {\n  print(\"Hello, \${name ?? 'stranger'}!\");\n}",
        options: [
            { text: "`greet();` prints “Hello, stranger!”", correct: true, id: 'ws16_dart_q1_opt0' },
            { text: "`greet(null);` prints “Hello, stranger!”", correct: true, id: 'ws16_dart_q1_opt1' },
            { text: "`greet(3);` prints “Hello, stranger!”", correct: false, id: 'ws16_dart_q1_opt2' },
            { text: "`greet(\"Aya\");` prints “Hello, Aya!”", correct: true, id: 'ws16_dart_q1_opt3' },
            { text: "`greet('')` prints “Output: Hello, stranger!”.", correct: false, id: 'ws16_dart_q1_opt4' }
        ],
        correctAnswers: ['ws16_dart_q1_opt0', 'ws16_dart_q1_opt1', 'ws16_dart_q1_opt3'],
        explanation: "The null-coalescing operator `??` provides a default value ('stranger') if `name` is `null`. 1. `greet()`: `name` is `null` by default if no argument is passed for a nullable type, so it uses 'stranger'. 2. `greet(null)`: `name` is explicitly `null`, uses 'stranger'. 3. `greet(3)`: This is a type error; `3` (int) cannot be assigned to `String?`. The function wouldn't print “Hello, stranger!” due to this error. 4. `greet(\"Aya\")`: `name` is \"Aya\", so it prints \"Hello, Aya!\". 5. `greet('')`: `name` is an empty string `''`, which is not `null`, so it prints \"Hello, !\". "
    },
    {
        id: 'ws16_dart_q2',
        type: 'multiple-choice',
        category: 'conceptual',
        text: "What is the purpose of using `List<String> arguments` in the `main` function of a Dart program? Select the correct answer.",
        options: [
            { text: "To specify default values for all functions in the program.", correct: false },
            { text: "To pass a fixed number of required arguments to the `main` function.", correct: false },
            { text: "To receive a list of `Strings` when the `main` function is run from other files.", correct: false },
            { text: "To receive a list of `Strings` when the program is run in the command-line.", correct: true }
        ],
        explanation: "The `main(List<String> arguments)` function signature allows the Dart program to receive arguments passed to it when executed from the command line. Each argument is provided as a string in the `arguments` list."
    },
    {
        id: 'ws16_dart_q3',
        type: 'multiple-select',
        category: 'code',
        text: "Which of the following functions can be converted into an arrow function (with minor changes)? Select all that apply.",
        options: [
            { text: "```dart\nvoid printNumber() {\n  print(5);\n}```", code: "void printNumber() {\n  print(5);\n}", correct: true, id: 'ws16_dart_q3_opt0' },
            { text: "```dart\nint addNumbers(int a, int b) {\n  return a + b;\n}```", code: "int addNumbers(int a, int b) {\n  return a + b;\n}", correct: true, id: 'ws16_dart_q3_opt1' },
            { text: "```dart\ndouble circleArea(double radius) {\n  print(\"Calculating...\");\n  return pi * pow(radius, 2);\n}```", code: "double circleArea(double radius) {\n  print(\"Calculating...\");\n  return pi * pow(radius, 2);\n}", correct: false, id: 'ws16_dart_q3_opt2' },
            { text: "```dart\nString shout(String message) {\n  String loudMessage = message.toUpperCase();\n  return loudMessage;\n}```", code: "String shout(String message) {\n  String loudMessage = message.toUpperCase();\n  return loudMessage;\n}", correct: true, id: 'ws16_dart_q3_opt3' },
            { text: "```dart\nint triple(int x) {\n  int result = x * 3;\n  return result;\n}```", code: "int triple(int x) {\n  int result = x * 3;\n  return result;\n}", correct: true, id: 'ws16_dart_q3_opt4' }
        ],
        correctAnswers: ['ws16_dart_q3_opt0', 'ws16_dart_q3_opt1', 'ws16_dart_q3_opt3', 'ws16_dart_q3_opt4'],
        explanation: "Arrow functions (`=>`) are used for functions that contain only a single expression. \n1. `void printNumber() => print(5);` (Single expression)\n2. `int addNumbers(int a, int b) => a + b;` (Single expression)\n3. `circleArea` has two statements (`print` and `return`), so it cannot be directly converted to an arrow function.\n4. `shout` can be simplified to `String shout(String message) => message.toUpperCase();` (Single expression after minor change).\n5. `triple` can be simplified to `int triple(int x) => x * 3;` (Single expression after minor change)."
    },
    {
        id: 'ws16_dart_q4',
        type: 'multiple-choice',
        category: 'code',
        text: "What will this program print given 12 and 21 as `x` and `y` respectively? Select the correct answer.",
        code: "void someFunction(int x, int y) {\n  if (x > y) {\n    print(1);\n  } else if (x < y) {\n    if (x != 10 && y == 20) {\n      print(2);\n    } else {\n      print(3);\n    }\n  } else {\n    print(4);\n  }\n}",
        options: [
            { text: "1", correct: false },
            { text: "2", correct: false },
            { text: "3", correct: true },
            { text: "4", correct: false }
        ],
        explanation: "Given x=12 and y=21:\n1. `x > y` (12 > 21) is false.\n2. Control goes to `else if (x < y)` (12 < 21), which is true.\n3. Inside this block, `if (x != 10 && y == 20)` is evaluated. `x != 10` (12 != 10) is true. `y == 20` (21 == 20) is false.\n4. Since `true && false` is false, the `else` part of this inner `if` is executed, which is `print(3);`."
    },
    {
        id: 'ws16_dart_q5',
        type: 'multiple-choice',
        category: 'code',
        text: "Consider the following Dart while loop, what is the value of `a` when the loop terminates? Select the correct answer.",
        code: "int a = 10;\nwhile(a > 5) {\n  a -= 2;\n}",
        options: [
            { text: "5", correct: false },
            { text: "4", correct: true },
            { text: "3", correct: false },
            { text: "6", correct: false }
        ],
        explanation: "Initial: `a = 10`.\n1. `a > 5` (10 > 5) is true. `a` becomes `10 - 2 = 8`.\n2. `a > 5` (8 > 5) is true. `a` becomes `8 - 2 = 6`.\n3. `a > 5` (6 > 5) is true. `a` becomes `6 - 2 = 4`.\n4. `a > 5` (4 > 5) is false. The loop terminates.\nThe final value of `a` is `4`."
    },
    {
        id: 'ws16_dart_q6',
        type: 'multiple-choice',
        category: 'code',
        text: "What is the correct way to write a for loop in Dart that prints numbers 100, 80, 60, 40, 20? Select the correct answer.",
        options: [
            { text: "```dart\nfor(int i = 10; i <= 100; i++) {\n  print(i);\n}```", correct: false },
            { text: "```dart\nfor(int i = 2; i <= 10; i++) {\n  print(i * 10);\n}```", correct: false },
            { text: "```dart\nfor(int i = 2; i <= 10; i = i + 2) {\n  print(i * 10);\n}```", correct: false },
            { text: "```dart\nfor(int i = 10; i > 2; i = i - 2) {\n  print(i * 10);\n}```", correct: false }, // Prints 100, 80, 60, 40
            { text: "```dart\nfor (int i = 100; i >= 0; i -= 20) {\n  print(i);\n}```", correct: false }, // Prints 100, 80, 60, 40, 20, 0
            { text: "```dart\nfor (int i = 100; i > 0; i = i - 20)  {\n  print(i);\n}```", correct: true }  // Prints 100, 80, 60, 40, 20
        ],
        explanation: "The loop `for (int i = 100; i > 0; i = i - 20)` starts `i` at 100. It continues as long as `i` is greater than 0. In each iteration, `i` is printed and then reduced by 20. This produces the sequence: 100, 80, 60, 40, 20. The loop stops when `i` becomes 0 (0 > 0 is false)."
    },
    // Worksheet 17
    {
        id: 'ws17_dart_q0',
        type: 'multiple-select',
        category: 'conceptual',
        text: "Select all the true statements about Strings, Lists, Sets, and Maps in Dart:",
        options: [
            { text: "The elements inside lists can be modified in runtime but not in compile time.", correct: true, id: 'ws17_dart_q0_opt0' },
            { text: "Given this map `emojis = {1: '😎', 2: '🤩'}`, the assignment `emojis[x] = '😍'` creates a new element if x is not 1 or 2.", correct: true, id: 'ws17_dart_q0_opt1' },
            { text: "`List<Object> list = [1, 'two', 3.0];` definition creates an error, as `List`s cannot contain elements of different types.", correct: false, id: 'ws17_dart_q0_opt2' },
            { text: "The `remove` method of a List removes all occurrences of the specified element from the list.", correct: false, id: 'ws17_dart_q0_opt3' },
            { text: "Inserting `'🐒'` at index 1 of the list `['🐓', '🐄', '🐖']`, will result in `['🐓', '🐄', '🐒',  '🐖']`.", correct: false, id: 'ws17_dart_q0_opt4' },
            { text: "When iterating over a set using a for-in loop, the elements are accessed in the order they were inserted.", correct: false, id: 'ws17_dart_q0_opt5' }
        ],
        correctAnswers: ['ws17_dart_q0_opt0', 'ws17_dart_q0_opt1'],
        explanation: "1. List elements are mutable at runtime; compile-time checks types and structure. 2. Assigning to a map with a new key adds the key-value pair. 3. `List<Object>` (or `List<dynamic>`) explicitly allows elements of different types. 4. `List.remove()` removes only the first occurrence of the specified element. 5. `list.insert(1, '🐒')` would result in `['🐓', '🐒', '🐄', '🐖']`. 6. The default `Set` implementation (`LinkedHashSet`) preserves insertion order, but the general `Set` interface contract does not guarantee any specific order."
    },
    {
        id: 'ws17_dart_q1',
        type: 'multiple-choice',
        category: 'conceptual',
        text: "What is the first step of converting the string `\"apples_and_pears\"` to `\"applesAndPears\"`? Select the correct answer:",
        options: [
            { text: "Use the `toUpperCase` method on the first letter of the second word.", correct: false },
            { text: "Split the string by `\"_\"` into a `List` of substrings.", correct: true },
            { text: "Reverse the string by first splitting it by `\"\"`.", correct: false },
            { text: "Use the `contains` method to check for underscores.", correct: false },
            { text: "Find the location of the first letter of each word in the string with the `indexOf` method.", correct: false }
        ],
        explanation: "To convert snake_case to camelCase (like `apples_and_pears` to `applesAndPears`), the typical first step is to split the string by the delimiter (`_`) into parts (`['apples', 'and', 'pears']`). Then, subsequent parts (from the second onwards) would have their first letter capitalized before joining them."
    },
    {
        id: 'ws17_dart_q2',
        type: 'multiple-choice',
        category: 'code',
        text: "What is the output of `print('Flutter'.indexOf('t'))`? Select all that apply:",
        options: [
            { text: "2", correct: false },
            { text: "3", correct: true },
            { text: "4", correct: false },
            { text: "3 and 4", correct: false },
            { text: "2 and 3", correct: false }
        ],
        explanation: "The `indexOf` method returns the starting index of the first occurrence of the specified substring. In 'Flutter': F (index 0), l (index 1), u (index 2), t (index 3), t (index 4), e (index 5), r (index 6). The first 't' is at index 3."
    },
    {
        id: 'ws17_dart_q3',
        type: 'multiple-select',
        category: 'conceptual',
        text: "Which of the following `String` methods can be used to locate a substring within a `String`? Select all that apply:",
        options: [
            { text: "`startsWith()`", correct: true, id: 'ws17_dart_q3_opt0' },
            { text: "`endsWith()`", correct: true, id: 'ws17_dart_q3_opt1' },
            { text: "`contains()`", correct: true, id: 'ws17_dart_q3_opt2' },
            { text: "`split()`", correct: false, id: 'ws17_dart_q3_opt3' },
            { text: "`join()`", correct: false, id: 'ws17_dart_q3_opt4' },
            { text: "`substring()`", correct: false, id: 'ws17_dart_q3_opt5' }
        ],
        correctAnswers: ['ws17_dart_q3_opt0', 'ws17_dart_q3_opt1', 'ws17_dart_q3_opt2'],
        explanation: "`startsWith()` checks if the string begins with a substring. `endsWith()` checks if it ends with a substring. `contains()` checks if the string includes the substring anywhere. `indexOf()` and `lastIndexOf()` also locate substrings by returning their index. `split()` divides a string, `join()` combines list elements, and `substring()` extracts a part of a string."
    },
    {
        id: 'ws17_dart_q4',
        type: 'multiple-select',
        category: 'conceptual',
        text: "Which of the following is the correct way to define a `List` of `String`s in Dart?",
        options: [
            { text: "`List<String> colours = List<String>('Red', 'Green', 'Blue');`", correct: false, id: 'ws17_dart_q4_opt0' },
            { text: "`List colours = ['Red', 'Green', 'Blue'];`", correct: true, id: 'ws17_dart_q4_opt1' },
            { text: "`String[] colours = ['Red', 'Green', 'Blue'];`", correct: false, id: 'ws17_dart_q4_opt2' },
            { text: "`List<String> colours = List.filled('Red', 'Green', 'Blue');`", correct: false, id: 'ws17_dart_q4_opt3' },
            { text: "`List<String> colours = ['Red', 'Green', 'Blue'];`", correct: true, id: 'ws17_dart_q4_opt4' }
        ],
        correctAnswers: ['ws17_dart_q4_opt1', 'ws17_dart_q4_opt4'],
        explanation: "Both `List colours = ['Red', 'Green', 'Blue'];` (where Dart infers the type `List<String>`) and `List<String> colours = ['Red', 'Green', 'Blue'];` (explicitly typed) are correct ways to define a list of strings using a list literal. Option 1 has an invalid constructor. Option 3 is not Dart syntax. Option 4 `List.filled` constructor takes a length and a fill value, not list elements."
    },
    {
        id: 'ws17_dart_q5',
        type: 'multiple-select',
        category: 'code',
        text: "Which of the following functions correctly adds a given integer to each element of a list and then returns the modified list back to the caller? Select all that apply:",
        options: [
            { text: "```dart\nList<int> addToList(List<int> list, int addition) {\n  for (int number in list) {\n    number += addition;\n  }\n  return list;\n}```", code:"List<int> addToList(List<int> list, int addition) {\n  for (int number in list) {\n    number += addition;\n  }\n  return list;\n}", correct: false, id: 'ws17_dart_q5_opt0' },
            { text: "```dart\nList<int> addToList(List<int> list, int addition) {\n  for (int element of list) {\n    element = element + addition;\n  }\n  return list;\n}```", code:"List<int> addToList(List<int> list, int addition) {\n  for (int element of list) {\n    element = element + addition;\n  }\n  return list;\n}", correct: false, id: 'ws17_dart_q5_opt1' },
            { text: "```dart\nList<int> addToList(List<int> list, int addition) {\n  for (int i = 0; i <= list.length; i++) {\n    list[i] += addition;\n  }\n  return list;\n}```", code:"List<int> addToList(List<int> list, int addition) {\n  for (int i = 0; i <= list.length; i++) {\n    list[i] += addition;\n  }\n  return list;\n}", correct: false, id: 'ws17_dart_q5_opt2' },
            { text: "```dart\nList<int> addToList(List<int> list, int addition) {\n  for (int i = 0; i < list.length; i = i + 1) {\n    list[i] = list[i] + addition;\n  }\n  return list;\n}```", code:"List<int> addToList(List<int> list, int addition) {\n  for (int i = 0; i < list.length; i = i + 1) {\n    list[i] = list[i] + addition;\n  }\n  return list;\n}", correct: true, id: 'ws17_dart_q5_opt3' }
        ],
        correctAnswers: ['ws17_dart_q5_opt3'],
        explanation: "Options 1 and 2 use a for-in loop where `number` or `element` is a copy of the list item's value; modifying it doesn't change the original list. Option 3 has a loop condition `i <= list.length` which will cause a RangeError on the last iteration as valid indices are `0` to `list.length - 1`. Option 4 correctly uses an indexed for loop to access and modify each element of the list in place."
    },
    {
        id: 'ws17_dart_q6',
        type: 'multiple-choice',
        category: 'code',
        text: "What will happen if the function shown below is called with the `Set`: `{'milkshake', 'pizza', 'banana milk', 'cheesy chips'}`? Select the correct answer.",
        code:
`void lactoseIntolerant(Set<String> foods) {
  for (String food in foods) {
    if (food.contains('milk')) {
      foods.remove(food);
    }
  }
  print(foods);
}`,
        options: [
            { text: "It will print `{'pizza', 'cheesy chips'}`", correct: false },
            { text: "It will print `{'pizza'}`", correct: false },
            { text: "It will print `{'milkshake', 'pizza', 'banana milk', 'cheesy chips'}`", correct: false },
            { text: "An error will occur during the first iteration of the loop", correct: true },
            { text: "The function will enter an infinite loop as there are no 'milk' elements", correct: false }
        ],
        explanation: "Modifying a collection (like a Set or List) while iterating over it using a standard for-in loop will result in a `ConcurrentModificationError`. When an item containing 'milk' is found and `foods.remove(food)` is called, the underlying structure of the Set is changed during iteration, which is not allowed."
    },
    {
        id: 'ws17_dart_q7',
        type: 'multiple-select',
        category: 'code',
        text: "Which of the following removes the second key-value pair from the `Map` shown below? Select all that apply:",
        code: "Map<String, int> scores = {'Dhivyah ': 90, 'ÁLvaro': 85};",
        options: [
            { text: "`scores.delete('ÁLvaro');`", correct: false, id: 'ws17_dart_q7_opt0' },
            { text: "`scores.remove('ÁLvaro');`", correct: true, id: 'ws17_dart_q7_opt1' },
            { text: "`scores.delete(1);`", correct: false, id: 'ws17_dart_q7_opt2' },
            { text: "`scores.delete(85);`", correct: false, id: 'ws17_dart_q7_opt3' },
            { text: "`scores.remove('ÁLvaro', 85);`", correct: false, id: 'ws17_dart_q7_opt4' },
            { text: "`scores.remove = scores.last;`", correct: false, id: 'ws17_dart_q7_opt5' }
        ],
        correctAnswers: ['ws17_dart_q7_opt1'],
        explanation: "The `Map.remove()` method takes a key as an argument and removes the key-value pair associated with that key. The key for the second pair is 'ÁLvaro'. There is no `delete` method for Maps in Dart. Other options attempt to remove by index or value incorrectly, or use invalid syntax."
    },
    {
        id: 'ws17_dart_q8',
        type: 'multiple-choice',
        category: 'code',
        text: "What does the following Dart function print? Select the correct answer.",
        code:
`void checkProduct() {
  Map<String, double> prices = {
    'Bread': 1.5,
    'Milk': 1.0,
    'Eggs': 2.0,
  };
  if (prices.containsKey('Egg')) {
    print('Eggs cost £\${prices['Eggs']}');
  }
}`,
        options: [
            { text: "`Eggs cost £null`", correct: false },
            { text: "`Eggs cost £2.0`", correct: false },
            { text: "`Eggs cost £${2.0}`", correct: false },
            { text: "Nothing", correct: true },
            { text: "An error occurs", correct: false }
        ],
        explanation: "The `Map.containsKey()` method is case-sensitive. The map `prices` contains the key 'Eggs' (plural, capital 'E'), but the condition checks for 'Egg' (singular, capital 'E'). Since the key 'Egg' is not found, the `if` condition is false, and the `print` statement inside the `if` block is not executed. Therefore, the function prints nothing."
    },
    // Worksheet 18 (OOP)
    {
        id: 'ws18_dart_q0',
        type: 'multiple-select',
        category: 'conceptual',
        text: "Select all the true statements about Object-Oriented Programming (OOP) in Dart.",
        options: [
            { text: "To create an object in Dart, we have to use the `new` keyword.", correct: false, id: 'ws18_dart_q0_opt0' },
            { text: "The superclass of a class is defined using the `extends` keyword.", correct: true, id: 'ws18_dart_q0_opt1' },
            { text: "The `Team` class is composed of a list of `Player` objects, hence it has an instance variable of type `List<Player>`.", correct: true, id: 'ws18_dart_q0_opt2' },
            { text: "If we define an instance variable `_password` in the `User` class, we can access it using `user._password` in another class as long as it is defined in the same file.", correct: true, id: 'ws18_dart_q0_opt3' }, // Same library (usually same file)
            { text: "Getters and setters in Dart do not have parameter lists.", correct: false, id: 'ws18_dart_q0_opt4' }
        ],
        correctAnswers: ['ws18_dart_q0_opt1', 'ws18_dart_q0_opt2', 'ws18_dart_q0_opt3'],
        explanation: "1. The `new` keyword is optional in Dart for creating objects. 2. `extends` is used for inheritance. 3. This describes composition ('has-a' relationship). 4. An underscore `_` prefix makes a member library-private, meaning it's accessible within the same library (typically the same file). 5. Getters have no parameters, but setters have exactly one parameter."
    },
    {
        id: 'ws18_dart_q1',
        type: 'multiple-select',
        category: 'code',
        text: "Consider the `Phone` class shown below. Which of the following is the correct way to create a `Phone` object? Select all that apply.",
        code:
`class Phone {
  String name;
  String brand;
  int memory;

  Phone(this.name, this.brand, {this.memory = 64});
}`,
        options: [
            { text: "`Phone myPhone = Phone('iPhone 12', 'Apple');`", correct: true, id: 'ws18_dart_q1_opt0' },
            { text: "`Phone myPhone = Phone('iPhone 12', 'Apple', 64);`", correct: false, id: 'ws18_dart_q1_opt1' },
            { text: "`var galaxy = Phone('Galaxy S21', 'Samsung', memory: 128);`", correct: true, id: 'ws18_dart_q1_opt2' },
            { text: "`phone galaxy = Phone(name: 'Galaxy S21', brand: 'Samsung', memory: 128);`", correct: false, id: 'ws18_dart_q1_opt3' },
            { text: "`phone galaxy= Phone('Galaxy S21', 'Samsung', memory: 128)`;", correct: false, id: 'ws18_dart_q1_opt4' }
        ],
        correctAnswers: ['ws18_dart_q1_opt0', 'ws18_dart_q1_opt2'],
        explanation: "1. `Phone('iPhone 12', 'Apple')` correctly calls the constructor with positional arguments, and the named parameter `memory` uses its default value of 64. 2. `Phone('iPhone 12', 'Apple', 64)` is incorrect because `memory` is a named parameter and must be specified with its name (e.g., `memory: 64`) if provided after positional arguments, or if you mean to pass it positionally, the constructor doesn't allow it for `memory`. 3. `Phone('Galaxy S21', 'Samsung', memory: 128)` is correct; it provides positional arguments and then the named argument `memory`. 4 & 5. `phone` (lowercase) is not a valid type name in Dart (should be `Phone` or `var`). Also, `name:` and `brand:` are not used for positional parameters."
    },
    {
        id: 'ws18_dart_q2',
        type: 'multiple-choice',
        category: 'code',
        text: "What is the output of the `main` function shown below? Select the correct answer.",
        code:
`class Rectangle {
  double width = 0;
  double height = 0;

  Rectangle(this.width, this.height);

  double getArea() => width * height;
}

void main() {
  Rectangle myRectangle = Rectangle(3, 4);
  double area = myRectangle.getArea();
  print('\$area, \$myRectangle');
}`,
        options: [
            { text: "`12, Instance of 'Rectangle'`", correct: false },
            { text: "`12.0, Instance of 'Rectangle'`", correct: true },
            { text: "`12.0, Rectangle`", correct: false },
            { text: "`12, Rectangle object at 0x000001C9081DE9D0`", correct: false },
            { text: "`Error: class 'Rectangle' has no instance variable named 'area'.`", correct: false }
        ],
        explanation: "`myRectangle.getArea()` calculates `3 * 4 = 12`. Since `width` and `height` can be `double` (and `getArea` returns `double`), `area` will be `12.0`. When an object is printed and it doesn't have a custom `toString()` method overriding the default, `Object.toString()` is called, which typically returns `Instance of 'ClassName'`. So the output is `12.0, Instance of 'Rectangle'`."
    },
    // Question ws18_dart_q3 is missing in the input. I'll skip it.
    {
        id: 'ws18_dart_q4',
        type: 'multiple-select',
        category: 'code',
        text: "Suppose the following `BankAccount` class is added in a file called `lect18.dart` and it is imported into `main.dart` file. Which of the following statements is true?",
        code:
`class BankAccount {
  String accountNumber;
  double _balance = 0.0;

  BankAccount(this.accountNumber);

  void deposit(double amount) {
    _balance += amount;
  }

  double get balance => _balance;
}`,
        options: [
            { text: "The `deposit` method is accessible in `main.dart`.", correct: true, id: 'ws18_dart_q4_opt0' },
            { text: "We can get `balance` in `main.dart`.", correct: true, id: 'ws18_dart_q4_opt1' },
            { text: "We can set `balance` in `main.dart`.", correct: false, id: 'ws18_dart_q4_opt2' },
            { text: "We can get `_balance` in `main.dart`.", correct: false, id: 'ws18_dart_q4_opt3' },
            { text: "We can get `_balance` in `lect18.dart` file.", correct: true, id: 'ws18_dart_q4_opt4' }
        ],
        correctAnswers: ['ws18_dart_q4_opt0', 'ws18_dart_q4_opt1', 'ws18_dart_q4_opt4'],
        explanation: "1. `deposit` is a public method, so it's accessible from `main.dart` (assuming `BankAccount` class itself is accessible). 2. `balance` is a public getter, so its value can be read from `main.dart`. 3. There is no public setter for `balance`, so it cannot be directly set from `main.dart`. 4. `_balance` is library-private (due to the `_` prefix), so it cannot be accessed directly from `main.dart` if `main.dart` is in a different library (different file usually implies different library unless part of the same `library` directive). 5. `_balance` is accessible within its own library, so it can be accessed from other code within `lect18.dart`."
    },
    // Question ws18_dart_q5 is missing in the input. I'll skip it.
    {
        id: 'ws18_dart_q6',
        type: 'multiple-select',
        category: 'code',
        text: "Consider the following classes. Which of the following statements is true?",
        code:
`class Animal {
  String name;

  Animal(this.name);

  void eat() => print('\$name is eating.');

  String toString() => name;
}

class Dog extends Animal {
  String breed;

  Dog(String name, this.breed) : super(name);

  void bark() => print('Woof!');

  String toString() => '\$name the \$breed';
}`,
        options: [
            { text: "Only `Dog` objects have a `name` instance variable.", correct: false, id: 'ws18_dart_q6_opt0' },
            { text: "All `Dog` objects have a `bark` method.", correct: true, id: 'ws18_dart_q6_opt1' },
            { text: "The `toString` method in `Dog` overrides `toString` of `Animal`.", correct: true, id: 'ws18_dart_q6_opt2' },
            { text: "The `super` keyword is used to call the `eat` method in `Animal`.", correct: false, id: 'ws18_dart_q6_opt3' },
            { text: "The `Animal` class cannot be instantiated (you can only create `Dog` objects).", correct: false, id: 'ws18_dart_q6_opt4' }
        ],
        correctAnswers: ['ws18_dart_q6_opt1', 'ws18_dart_q6_opt2'],
        explanation: "1. `Dog` objects inherit the `name` instance variable from `Animal`. 2. The `bark` method is defined in the `Dog` class. 3. `Dog` provides its own implementation of `toString`, thereby overriding the one inherited from `Animal`. 4. The `super` keyword is used in `Dog`'s constructor to call `Animal`'s constructor (`super(name)`). It's not used here to call `eat()`. 5. The `Animal` class is a concrete class and can be instantiated."
    }
];
// The rest of your script.js (helper functions, event listeners etc.) follows from here...
    // Console log for debugging (can be removed in production)
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
        examContainer.innerHTML = '';
        let questionHTML = '';
        try {
            currentQuestions.forEach((q, index) => {
                questionHTML += `<div class="question-card" id="question-${index}">`;
                questionHTML += `<p class="question-number">Question ${index + 1} of ${currentQuestions.length}</p>`;
                questionHTML += `<p class="question-text">${escapeHTML(q.text)}</p>`;

                if (q.code) {
                    // Code is also text here, so escape for safety in <pre><code>
                    const escapedCode = q.code ? escapeHTML(q.code) : '';
                    questionHTML += `<pre class="code-block"><code>${escapedCode}</code></pre>`;
                }

                questionHTML += `<div class="options-container">`;
                if (q.options && (q.type === 'multiple-choice' || q.type === 'code-snippet')) {
                    q.options.forEach((opt) => {
                        // The 'value' attribute should contain the raw text for comparison.
                        // The displayed text next to the input is escaped.
                        questionHTML += `
                            <label>
                                <input type="radio" name="question${q.id}" value="${escapeHTML(opt.text)}"> 
                                ${escapeHTML(opt.text)}
                            </label>`;
                    });
                } else if (q.options && q.type === 'multiple-select') {
                    q.options.forEach((opt) => {
                        questionHTML += `
                            <label>
                                <input type="checkbox" name="question${q.id}" value="${escapeHTML(opt.text)}" data-option-id="${opt.id}">
                                ${escapeHTML(opt.text)}
                            </label>`;
                    });
                }
                questionHTML += `</div>`;
                questionHTML += `<div class="explanation" style="display:none;"><p><strong>Explanation:</strong> ${escapeHTML(q.explanation)}</p></div>`;
                questionHTML += `</div>`;
            });
        } catch (error) {
            console.error("Error during HTML generation in renderQuestions:", error);
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
            detailedFeedbackHTML += `<p><strong>Question ${index + 1}:</strong> ${escapeHTML(q.text)}</p>`;
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
                    const userAnswerValue = selectedOptionInput.value; // This value is HTML escaped
                    userAnswerHTML += userAnswerValue; // Display the (escaped) value

                    const correctOption = q.options.find(opt => opt.correct === true);
                    // Compare the HTML escaped input value with the HTML escaped correct option text
                    if (correctOption && userAnswerValue === escapeHTML(correctOption.text)) {
                        score++;
                        correct = true;
                    }
                } else {
                    userAnswerHTML += "No answer selected.";
                }
                const correctOptionData = q.options.find(opt => opt.correct);
                detailedFeedbackHTML += `<p>${userAnswerHTML}</p>`;
                if (correctOptionData) {
                    detailedFeedbackHTML += `<p>Correct answer: ${escapeHTML(correctOptionData.text)}</p>`;
                }

            } else if (q.type === 'multiple-select') {
                const selectedCheckboxes = document.querySelectorAll(`input[name="question${q.id}"]:checked`);
                let selectedIds = [];
                let selectedEscapedTexts = []; 
                if (selectedCheckboxes.length > 0) answered = true;

                selectedCheckboxes.forEach(cb => {
                    selectedIds.push(cb.dataset.optionId);
                    selectedEscapedTexts.push(cb.value); // cb.value is HTML escaped text
                });

                userAnswerHTML += selectedEscapedTexts.length > 0 ? selectedEscapedTexts.join(', ') : "No answer selected.";
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
                    .map(opt => escapeHTML(opt.text))
                    .join(', ');
                detailedFeedbackHTML += `<p>Correct answer(s): ${correctOptionsDisplayTexts}</p>`;
            }

            if (questionCard) {
                questionCard.classList.remove('correct', 'incorrect', 'unanswered');
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
            detailedFeedbackHTML += `<p class="explanation-text"><em>Explanation: ${escapeHTML(q.explanation)}</em></p>`;
            detailedFeedbackHTML += `</div><hr class="feedback-divider">`;
        });

        if(scoreDisplay) scoreDisplay.textContent = `${score} out of ${currentQuestions.length}`;
        if(feedbackArea) feedbackArea.innerHTML = detailedFeedbackHTML; // Already escaped during building
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
            if (currentQuestions.length > 25) { 
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
            if(scoreDisplay) scoreDisplay.textContent = '';
            if(feedbackArea) feedbackArea.innerHTML = '';
            if(resultsContainer) resultsContainer.style.display = 'none';
            if(examContainer) {
                const questionCards = examContainer.querySelectorAll('.question-card');
                questionCards.forEach(card => {
                    card.classList.remove('correct', 'incorrect', 'unanswered');
                    const explanationDiv = card.querySelector('.explanation');
                    if (explanationDiv) {
                        explanationDiv.style.display = 'none';
                    }
                });
            }
        });
    }
});