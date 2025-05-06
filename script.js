document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const examInitiationArea = document.getElementById('exam-initiation');
    const startExamButton = document.getElementById('start-exam-btn');

    const examArea = document.getElementById('exam-area');
    const examContainer = document.getElementById('exam-container');
    const submitButton = document.getElementById('submit-btn');
    const resultsContainer = document.getElementById('results-container');
    const scoreDisplay = document.getElementById('score');
    const feedbackArea = document.getElementById('feedback-area');
    const timerDisplay = document.getElementById('time');
    const restartButton = document.getElementById('restart-btn');
    const currentDateDisplay = document.getElementById('current-date');

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
    // Updated with "better formatted" questions, using previously reviewed answers/explanations.
    // !!! CRITICAL: ALWAYS VERIFY CORRECT ANSWERS AND EXPLANATIONS AGAINST YOUR CURRICULUM !!!
    allQuestions = [
        // This section corresponds to your "Worksheet 10" Python questions,
        // but I will map them to the Dart question IDs we used if the content matches,
        // or create new IDs if these are entirely new Python questions.
        // Based on your latest input, these are actually DART questions, I will use previous Dart structure.

        // Re-mapping to the Dart question set previously finalized:
        // Worksheet 15 (Dart Basics)
        {
            id: 'ws15_dart_q0',
            type: 'multiple-select',
            category: 'conceptual',
            text: "Select all the correct statements about static compiled low‑level programs, specifically, Dart:",
            options: [
                { text: "The data types are declared in statically typed languages to prevent common errors like values being out of the desired range.", correct: true, id: 'ws15_dart_q0_opt0' },
                { text: "The Dart SDK includes tools like a compiler, a debugger, the Dart shell and a package manager.", correct: true, id: 'ws15_dart_q0_opt1' },
                { text: "Every Dart file needs to have a main function.", correct: false, id: 'ws15_dart_q0_opt2' },
                { text: "The Dart compiler will throw an error if a value assigned to a variable does not match its declared type.", correct: true, id: 'ws15_dart_q0_opt3' },
                { text: "The reason ~/ is used for integer division in Dart instead of // is that the latter is reserved for in‑line comments.", correct: true, id: 'ws15_dart_q0_opt4' },
                { text: "There is no need to use curly brackets ({}) in Dart when string interpolating values or variables.", correct: false, id: 'ws15_dart_q0_opt5' }
            ],
            correctAnswers: ['ws15_dart_q0_opt0', 'ws15_dart_q0_opt1', 'ws15_dart_q0_opt3', 'ws15_dart_q0_opt4'],
            explanation: "1. Static typing helps catch type errors early. 2. The Dart SDK is comprehensive. 3. Only executable Dart programs require a `main()` entry point; libraries do not. 4. Dart's static type checking enforces type compatibility. 5. `//` is for single-line comments in Dart, and `~/` performs truncating division. 6. Curly braces are required for expressions (`\${expression}`) and for disambiguation (`\${variable}text`)."
        },
        {
            id: 'ws15_dart_q1',
            type: 'multiple-select',
            category: 'conceptual',
            text: "What are the characteristics of interpreted languages? Select all that apply.",
            options: [
                { text: "They require an interpreter at runtime.", correct: true, id: 'ws15_dart_q1_opt0' },
                { text: "They are generally slower than compiled languages.", correct: true, id: 'ws15_dart_q1_opt1' },
                { text: "They cannot be used for cross‑platform application development.", correct: false, id: 'ws15_dart_q1_opt2' },
                { text: "They are primarily used for scripting or high‑level programming.", correct: true, id: 'ws15_dart_q1_opt3' },
                { text: "We cannot specify the data types of variables in interpreted code.", correct: false, id: 'ws15_dart_q1_opt4' }
            ],
            correctAnswers: ['ws15_dart_q1_opt0', 'ws15_dart_q1_opt1', 'ws15_dart_q1_opt3'],
            explanation: "Interpreted languages execute code line-by-line at runtime via an interpreter, which is generally slower than running pre-compiled code. They are often used for scripting. Many are cross-platform (e.g., Python, JavaScript). Some interpreted languages support type specifications or hints."
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
            explanation: "Compiled languages translate code to machine code before execution, enabling direct OS execution for faster performance, suitable for apps and GUIs. Dart compiles to native or JavaScript. The build step itself takes time. Interpreters (not compilers) run code line by line."
        },
        {
            id: 'ws15_dart_q3',
            type: 'multiple-select',
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
            explanation: "`String name = 'Ayodeji';` is a valid explicit declaration. `var name = \"Ayodeji\";` (if an option) would also be valid via type inference. `string` (lowercase) is incorrect. Missing quotes around `Ayodeji` in option 3 makes it an identifier. Option 4 is assignment. Option 5 is comparison."
        },
        {
            id: 'ws15_dart_q4a', // First "Question 4"
            type: 'multiple-choice',
            category: 'code',
            text: "What is the output of the following Dart code? Select the correct answer.",
            code: "double price = 3.5;\nint amount = 2;\nprint('Total: \$\${price * amount}');",
            options: [
                { text: "Total: $3.5 * 2", correct: false },
                { text: "Total: $7.0", correct: true },
                { text: "Total: 7.0", correct: false },
                { text: "Total: $7", correct: false },
                { text: "Total: 7", correct: false },
                { text: "Error", correct: false }
            ],
            explanation: "The expression `price * amount` is `7.0`. The string `'Total: \$\${price * amount}'` has `\$` (literal dollar sign) followed by `\${price * amount}` (interpolated value `7.0`). So, output is `Total: $7.0`."
        },
        {
            id: 'ws15_dart_q4b', // Second "Question 4"
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
            explanation: "`a ~/= b` means `a = a ~/ b` (integer division), so `a = 9 ~/ 2` which is `4`. Then `b += a` means `b = b + a`, so `b = 2 + 4` which is `6`. Finally, `print(a * b)` prints `4 * 6 = 24`."
        },
        {
            id: 'ws15_dart_q5',
            type: 'multiple-select',
            category: 'code',
            text: "The return types of the following functions have not been declared. Select all the correct options:",
            options: [
                { text: "`greet` returns a `double`:\n\n```dart\ngreet() {\n  var age = \"20\";\n  return double.parse(age);\n}```", code: "greet() {\n  var age = \"20\";\n  return double.parse(age);\n}", correct: true, id: 'ws15_dart_q5_opt0' },
                { text: "`getANumber` returns a `String`:\n\n```dart\nimport 'dart:io';\ngetANumber() {\n  print('Enter a number:');\n  var a = stdin.readLineSync();\n  return a;\n}```", code: "import 'dart:io';\ngetANumber() {\n  print('Enter a number:');\n  var a = stdin.readLineSync();\n  return a;\n}", correct: true, id: 'ws15_dart_q5_opt1' },
                { text: "`checkEven` returns a `bool`:\n\n```dart\nimport 'dart:io';\ncheckEven() {\n  print('Enter a number:');\n  int num = int.parse(stdin.readLineSync()!); \n  return num % 2 == 0;\n}```", code: "import 'dart:io';\ncheckEven() {\n  print('Enter a number:');\n  int num = int.parse(stdin.readLineSync()!); \n  return num % 2 == 0;\n}", correct: true, id: 'ws15_dart_q5_opt2' },
                { text: "`printName` returns a `String`:\n\n```dart\nimport 'dart:io';\nprintName() {\n  print('Enter your name:');\n  String? name = stdin.readLineSync();\n  print('Hello, \${name!.toUpperCase()}');\n}```", code: "import 'dart:io';\nprintName() {\n  print('Enter your name:');\n  String? name = stdin.readLineSync();\n  print('Hello, \${name!.toUpperCase()}');\n}", correct: false, id: 'ws15_dart_q5_opt3' },
                { text: "`divideNumbers` returns an `int`:\n\n```dart\ndivideNumbers() {\n  int a = 40;\n  int b = 8;\n  return a / b;\n}```", code: "divideNumbers() {\n  int a = 40;\n  int b = 8;\n  return a / b;\n}", correct: false, id: 'ws15_dart_q5_opt4' },
                { text: "`calculateSquareRoot` returns a `double`:\n\n```dart\nimport 'dart:math';\ncalculateSquareRoot() {\n  int num = 5;\n  return sqrt(num);\n}```", code: "import 'dart:math';\ncalculateSquareRoot() {\n  int num = 5;\n  return sqrt(num);\n}", correct: true, id: 'ws15_dart_q5_opt5' }
            ],
            correctAnswers: ['ws15_dart_q5_opt0', 'ws15_dart_q5_opt1', 'ws15_dart_q5_opt2', 'ws15_dart_q5_opt5'],
            explanation: "1. `double.parse()` returns `double`. 2. `stdin.readLineSync()` returns `String?`. 3. `num % 2 == 0` returns `bool`. 4. `printName` implicitly returns `void`. 5. `/` operator returns `double`. 6. `sqrt()` returns `double`."
        },
        // Worksheet 16
        {
            id: 'ws16_dart_q0',
            type: 'multiple-select',
            category: 'conceptual',
            text: "Select all correct statements when it comes to Dart's functions and control flow:",
            options: [
                { text: "The void keyword is used to define functions that return no specific type of data.", correct: true, id: 'ws16_dart_q0_opt0' },
                { text: "while loops can only iterate a known number of times (this count must be known before runtime).", correct: false, id: 'ws16_dart_q0_opt1' },
                { text: "Dart's null safety feature helps prevent creating variables that can be null.", correct: false, id: 'ws16_dart_q0_opt2' },
                { text: "We can cover multiple cases at once in a switch statement.", correct: true, id: 'ws16_dart_q0_opt3' },
                { text: "To make (a subset of) a function’s parameters into named parameters, it suffices to add curly brackets ({}) around them.", correct: true, id: 'ws16_dart_q0_opt4' }
            ],
            correctAnswers: ['ws16_dart_q0_opt0', 'ws16_dart_q0_opt3', 'ws16_dart_q0_opt4'],
            explanation: "1. `void` means no return value. 2. `while` loops iterate based on a condition. 3. Null safety manages nullability. 4. Dart switch allows fall-through or patterns. 5. `{}` defines named parameters."
        },
        {
            id: 'ws16_dart_q1',
            type: 'multiple-select', // Phrasing "select the correct answer" but multiple options describe correct behavior
            category: 'code',
            text: "Given the following function definition, select the correct answer.",
            code: "void greet(String? name) {\n  print(\"Hello, \${name ?? 'stranger'}!\");\n}",
            options: [
                { text: "`greet();` prints “Hello, stranger!”", correct: true, id: 'ws16_dart_q1_opt0' },
                { text: "`greet(null);` prints “Hello, stranger!”", correct: true, id: 'ws16_dart_q1_opt1' },
                { text: "`greet(3);` prints “Hello, stranger!”", correct: false, id: 'ws16_dart_q1_opt2' }, // Type error
                { text: "`greet(\"Aya\");` prints “Hello, Aya!”", correct: true, id: 'ws16_dart_q1_opt3' },
                { text: "`greet('')` prints “Output: Hello, stranger!”.", correct: false, id: 'ws16_dart_q1_opt4' } // Prints "Hello, !"
            ],
            correctAnswers: ['ws16_dart_q1_opt0', 'ws16_dart_q1_opt1', 'ws16_dart_q1_opt3'],
            explanation: "`name ?? 'stranger'` uses 'stranger' if `name` is null. `greet('')` uses empty string, printing 'Hello, !'. `greet(3)` would cause a compile-time error due to type mismatch."
        },
        {
            id: 'ws16_dart_q2',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "What is the purpose of using List<String> arguments in the main function of a Dart programme? Select the correct answer.",
            options: [
                { text: "To specify default values for all functions in the programme.", correct: false },
                { text: "To pass a fixed number of required arguments to the main function.", correct: false },
                { text: "To receive a list of Strings when the main function is run from other files.", correct: false },
                { text: "To receive a list of Strings when the programme is run from the command line.", correct: true }
            ],
            explanation: "`main(List<String> arguments)` receives command-line arguments passed to the program when it's executed."
        },
        {
            id: 'ws16_dart_q3',
            type: 'multiple-select',
            category: 'code',
            text: "Which of the following functions can be converted into an arrow function (with minor changes)? Select all that apply.",
            options: [
                { text: "```dart\nvoid printNumber() {\n  print(5);\n}```", code: "void printNumber() {\n  print(5);\n}", correct: true, id: 'ws16_dart_q3_opt0' },
                { text: "```dart\nint addNumbers(int a, int b) {\n  return a + b;\n}```", code: "int addNumbers(int a, int b) {\n  return a + b;\n}", correct: true, id: 'ws16_dart_q3_opt1' },
                { text: "```dart\ndouble circleArea(double radius) {\n  print(\"Calculating...\");\n  return pi * pow(radius, 2);\n}```", code: "import 'dart:math';\ndouble circleArea(double radius) {\n  print(\"Calculating...\");\n  return pi * pow(radius, 2);\n}", correct: false, id: 'ws16_dart_q3_opt2' },
                { text: "```dart\nString shout(String message) {\n  String loudMessage = message.toUpperCase();\n  return loudMessage;\n}```", code: "String shout(String message) {\n  String loudMessage = message.toUpperCase();\n  return loudMessage;\n}", correct: true, id: 'ws16_dart_q3_opt3' },
                { text: "```dart\nint triple(int x) {\n  int result = x * 3;\n  return result;\n}```", code: "int triple(int x) {\n  int result = x * 3;\n  return result;\n}", correct: true, id: 'ws16_dart_q3_opt4' }
            ],
            correctAnswers: ['ws16_dart_q3_opt0', 'ws16_dart_q3_opt1', 'ws16_dart_q3_opt3', 'ws16_dart_q3_opt4'],
            explanation: "Arrow functions (`=>`) are for functions containing a single expression. 1: `=> print(5);`. 2: `=> a + b;`. 3: Has two statements (`print` and `return`). 4: Can be `=> message.toUpperCase();`. 5: Can be `=> x * 3;`."
        },
        {
            id: 'ws16_dart_q4',
            type: 'multiple-choice',
            category: 'code',
            text: "What will this programme print given 12 and 21 as x and y respectively? Select the correct answer.",
            code: "if (x > y) {\n  print(1);\n} else if (x < y) {\n  if (x != 10 && y == 20) {\n    print(2);\n  } else {\n    print(3);\n  }\n} else {\n  print(4);\n}",
            options: [
                { text: "1", correct: false },
                { text: "2", correct: false },
                { text: "3", correct: true },
                { text: "4", correct: false }
            ],
            explanation: "Given x=12, y=21: `x > y` (12>21) is false. `x < y` (12<21) is true. Inner `if (x != 10 && y == 20)` becomes `(12!=10 && 21==20)`, which is `(true && false)`, evaluating to false. So, the inner `else` block executes, printing 3."
        },
        {
            id: 'ws16_dart_q5',
            type: 'multiple-choice',
            category: 'code',
            text: "Consider the following Dart while loop; what is the value of a when the loop terminates? Select the correct answer.",
            code: "int a = 10;\nwhile(a > 5) {\n  a -= 2;\n}",
            options: [
                { text: "5", correct: false },
                { text: "4", correct: true },
                { text: "3", correct: false },
                { text: "6", correct: false }
            ],
            explanation: "Initial: a = 10.\nIteration 1: 10 > 5 (true), a = 10 - 2 = 8.\nIteration 2: 8 > 5 (true), a = 8 - 2 = 6.\nIteration 3: 6 > 5 (true), a = 6 - 2 = 4.\nIteration 4: 4 > 5 (false). Loop terminates. Value of a is 4."
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
                { text: "```dart\nfor(int i = 10; i > 2; i = i - 2) {\n  print(i * 10);\n}```", correct: false },
                { text: "```dart\nfor (int i = 100; i >= 0; i -= 20) {\n  print(i);\n}```", correct: false },
                { text: "```dart\nfor (int i = 100; i > 0; i = i - 20)  {\n  print(i);\n}```", correct: true }
            ],
            explanation: "The loop `for (int i = 100; i > 0; i = i - 20)` starts `i` at 100, continues as long as `i` is greater than 0, and decrements `i` by 20. It will print: 100, 80, 60, 40, 20. The option with `i >= 0` would also print 0."
        },
        // Worksheet 17
        {
            id: 'ws17_dart_q0',
            type: 'multiple-select',
            category: 'conceptual',
            text: "Select all the true statements about Strings, Lists, Sets, and Maps in Dart:",
            options: [
                { text: "The elements inside lists can be modified in runtime but not in compile time.", correct: true, id: 'ws17_dart_q0_opt0' },
                { text: "Given this map emojis = {1: '😎', 2: '🤩'}, the assignment emojis[x] = '😍' creates a new element if x is not 1 or 2.", correct: true, id: 'ws17_dart_q0_opt1' },
                { text: "List<Object> list = [1, 'two', 3.0]; definition creates an error, as Lists cannot contain elements of different types.", correct: false, id: 'ws17_dart_q0_opt2' },
                { text: "The remove method of a List removes all occurrences of the specified element from the list.", correct: false, id: 'ws17_dart_q0_opt3' },
                { text: "Inserting '🐒' at index 1 of the list ['🐓', '🐄', '🐖'], will result in ['🐓', '🐄', '🐒',  '🐖'].", correct: false, id: 'ws17_dart_q0_opt4' },
                { text: "When iterating over a set using a for‑in loop, the elements are accessed in the order they were inserted.", correct: true, id: 'ws17_dart_q0_opt5' }
            ],
            correctAnswers: ['ws17_dart_q0_opt0', 'ws17_dart_q0_opt1', 'ws17_dart_q0_opt5'],
            explanation: "1. List elements are mutable at runtime. 2. Map assignment creates/updates. 3. `List<Object>` allows diverse types. 4. `List.remove` removes only the first match. 5. Insertion `['🐓', '🐒', '🐄', '🐖']`. 6. Default `Set` in Dart is `LinkedHashSet`, which preserves insertion order."
        },
        {
            id: 'ws17_dart_q1',
            type: 'multiple-choice',
            category: 'conceptual',
            text: "What is the first step of converting the string \"apples_and_pears\" to \"applesAndPears\"? Select the correct answer.",
            options: [
                { text: "Use the toUpperCase method on the first letter of the second word.", correct: false },
                { text: "Split the string by \"_\" into a List of substrings.", correct: true },
                { text: "Reverse the string by first splitting it by \"\".", correct: false },
                { text: "Use the contains method to check for underscores.", correct: false },
                { text: "Find the location of the first letter of each word in the string with the indexOf method.", correct: false }
            ],
            explanation: "To convert from snake_case to camelCase, the first operation is to break the string into parts based on the underscore delimiter."
        },
        {
            id: 'ws17_dart_q2',
            type: 'multiple-choice', // Though question says "select all", indexOf returns one value
            category: 'code',
            text: "What is the output of print('Flutter'.indexOf('t'))? Select all that apply.",
            options: [
                { text: "2", correct: false },
                { text: "3", correct: true },
                { text: "4", correct: false },
                { text: "3 and 4", correct: false },
                { text: "2 and 3", correct: false }
            ],
            explanation: "`indexOf('t')` returns the index of the *first* occurrence. In 'Flutter': F(0)l(1)u(2)t(3)t(4)e(5)r(6). The first 't' is at index 3."
        },
        {
            id: 'ws17_dart_q3',
            type: 'multiple-select',
            category: 'conceptual',
            text: "Which of the following String methods can be used to locate a substring within a String? Select all that apply.",
            options: [
                { text: "startsWith()", correct: true, id: 'ws17_dart_q3_opt0' },
                { text: "endsWith()", correct: true, id: 'ws17_dart_q3_opt1' },
                { text: "contains()", correct: true, id: 'ws17_dart_q3_opt2' },
                { text: "split()", correct: false, id: 'ws17_dart_q3_opt3' },
                { text: "join()", correct: false, id: 'ws17_dart_q3_opt4' },
                { text: "substring()", correct: false, id: 'ws17_dart_q3_opt5' }
            ],
            correctAnswers: ['ws17_dart_q3_opt0', 'ws17_dart_q3_opt1', 'ws17_dart_q3_opt2'],
            explanation: "`startsWith()`, `endsWith()`, and `contains()` are all used to determine if a substring exists at the beginning, end, or anywhere within a string, respectively. `indexOf()` and `lastIndexOf()` also locate by returning an index."
        },
        {
            id: 'ws17_dart_q4',
            type: 'multiple-select', // Changed to multiple select as both are valid
            category: 'conceptual',
            text: "Which of the following is the correct way to define a List of Strings in Dart?",
            options: [
                { text: "`List<String> colours = List<String>('Red', 'Green', 'Blue');`", correct: false, id: 'ws17_dart_q4_opt0' },
                { text: "`List colours = ['Red', 'Green', 'Blue'];`", correct: true, id: 'ws17_dart_q4_opt1' },
                { text: "`String[] colours = ['Red', 'Green', 'Blue'];`", correct: false, id: 'ws17_dart_q4_opt2' },
                { text: "`List<String> colours = List.filled('Red', 'Green', 'Blue');`", correct: false, id: 'ws17_dart_q4_opt3' },
                { text: "`List<String> colours = ['Red', 'Green', 'Blue'];`", correct: true, id: 'ws17_dart_q4_opt4' }
            ],
            correctAnswers: ['ws17_dart_q4_opt1', 'ws17_dart_q4_opt4'],
            explanation: "Both `List colours = ['Red', 'Green', 'Blue'];` (where type `List<String>` is inferred) and `List<String> colours = ['Red', 'Green', 'Blue'];` (explicitly typed) are correct using list literals. Other options use incorrect syntax or constructors."
        },
        {
            id: 'ws17_dart_q5',
            type: 'multiple-select',
            category: 'code',
            text: "Which of the following functions correctly adds a given integer to each element of a list and then returns the modified list back to the caller? Select all that apply.",
            options: [
                { text: "```dart\nList<int> addToList(List<int> list, int addition) {\n  for (int number in list) {\n    number += addition;\n  }\n  return list;\n}```", code:"List<int> addToList(List<int> list, int addition) {\n  for (int number in list) {\n    number += addition;\n  }\n  return list;\n}", correct: false, id: 'ws17_dart_q5_opt0' },
                { text: "```dart\nList<int> addToList(List<int> list, int addition) {\n  for (int element of list) {\n    element = element + addition;\n  }\n  return list;\n}```", code:"List<int> addToList(List<int> list, int addition) {\n  for (int element of list) {\n    element = element + addition;\n  }\n  return list;\n}", correct: false, id: 'ws17_dart_q5_opt1' },
                { text: "```dart\nList<int> addToList(List<int> list, int addition) {\n  for (int i = 0; i <= list.length; i++) {\n    list[i] += addition;\n  }\n  return list;\n}```", code:"List<int> addToList(List<int> list, int addition) {\n  for (int i = 0; i <= list.length; i++) {\n    list[i] += addition;\n  }\n  return list;\n}", correct: false, id: 'ws17_dart_q5_opt2' },
                { text: "```dart\nList<int> addToList(List<int> list, int addition) {\n  for (int i = 0; i < list.length; i = i + 1) {\n    list[i] = list[i] + addition;\n  }\n  return list;\n}```", code:"List<int> addToList(List<int> list, int addition) {\n  for (int i = 0; i < list.length; i = i + 1) {\n    list[i] = list[i] + addition;\n  }\n  return list;\n}", correct: true, id: 'ws17_dart_q5_opt3' }
            ],
            correctAnswers: ['ws17_dart_q5_opt3'],
            explanation: "Options 1 & 2: The for-in loop variable (`number` or `element`) is a copy; modifying it doesn't change the list. Option 3: The loop condition `i <= list.length` causes a RangeError. Option 4 correctly uses an index to modify the list elements in place."
        },
        {
            id: 'ws17_dart_q6',
            type: 'multiple-choice',
            category: 'code',
            text: "What will happen if the function shown below is called with the Set: {'milkshake', 'pizza', 'banana milk', 'cheesy chips'}? Select the correct answer.",
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
                { text: "It will print {'pizza', 'cheesy chips'}", correct: false },
                { text: "It will print {'pizza'}", correct: false },
                { text: "It will print {'milkshake', 'pizza', 'banana milk', 'cheesy chips'}", correct: false },
                { text: "An error will occur during the first iteration of the loop", correct: true },
                { text: "The function will enter an infinite loop as there are no 'milk' elements", correct: false }
            ],
            explanation: "Modifying a collection (like a Set) while iterating over it using a for-in loop is not allowed and will throw a `ConcurrentModificationError` when `foods.remove(food)` is executed during iteration."
        },
        {
            id: 'ws17_dart_q7',
            type: 'multiple-select',
            category: 'code',
            text: "Which of the following removes the second key‑value pair from the Map shown below? Select all that apply.",
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
            explanation: "The `remove` method on a Map takes the key of the entry to be removed. 'ÁLvaro' is the key for the second entry. Dart Maps do not have a `delete` method."
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
            explanation: "Map keys are case-sensitive. The map `prices` contains the key 'Eggs' (plural, capitalized). The `if` condition checks for the key 'Egg' (singular, capitalized). Since 'Egg' is not found, the condition is false, and nothing is printed."
        },
        // Worksheet 18 (OOP)
        {
            id: 'ws18_dart_q0',
            type: 'multiple-select',
            category: 'conceptual',
            text: "Select all the true statements about Object‑Oriented Programming (OOP) in Dart.",
            options: [
                { text: "To create an object in Dart, we have to use the new keyword.", correct: false, id: 'ws18_dart_q0_opt0' },
                { text: "The superclass of a class is defined using the extends keyword.", correct: true, id: 'ws18_dart_q0_opt1' },
                { text: "The Team class is composed of a list of Player objects, hence it has an instance variable of type List<Player>.", correct: true, id: 'ws18_dart_q0_opt2' },
                { text: "If we define an instance variable _password in the User class, we can access it using user._password in another class as long as it is defined in the same file.", correct: true, id: 'ws18_dart_q0_opt3' },
                { text: "Getters and setters in Dart do not have parameter lists.", correct: false, id: 'ws18_dart_q0_opt4' }
            ],
            correctAnswers: ['ws18_dart_q0_opt1', 'ws18_dart_q0_opt2', 'ws18_dart_q0_opt3'],
            explanation: "1. The `new` keyword is optional in Dart. 2. `extends` is used for inheritance. 3. This describes composition. 4. `_` denotes library-private, accessible within the same file/library. 5. Setters require one parameter; getters have none."
        },
        {
            id: 'ws18_dart_q1',
            type: 'multiple-select',
            category: 'code',
            text: "Consider the Phone class shown below. Which of the following is the correct way to create a Phone object? Select all that apply.",
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
                { text: "`phone galaxy= Phone('Galaxy S21', 'Samsung', memory: 128)`;", correct: false, id: 'ws18_dart_q1_opt4' } // Missing semicolon if it was a statement, and `phone` type.
            ],
            correctAnswers: ['ws18_dart_q1_opt0', 'ws18_dart_q1_opt2'],
            explanation: "Option 1 correctly uses positional arguments, and `memory` takes its default value. Option 2 tries to pass the named parameter `memory` as a positional argument. Option 3 correctly uses a named argument for `memory`. Options 4 and 5 use an incorrect type name `phone` (should be `Phone`) and option 4 incorrectly tries to use named arguments for positional parameters."
        },
        {
            id: 'ws18_dart_q2',
            type: 'multiple-choice',
            category: 'code',
            text: "What is the output of the main function shown below? Select the correct answer.",
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
            explanation: "`area` will be `12.0` (since `getArea` returns a `double`). When `myRectangle` is printed, its default `toString()` method (inherited from `Object`) is called, which typically results in `Instance of 'ClassName'`, so `Instance of 'Rectangle'`."
        },
        { // ws18_dart_q3 was missing, this is the original q4
            id: 'ws18_dart_q3_placeholder',
            type: 'multiple-select',
            category: 'code',
            text: "Suppose the following BankAccount class is added in a file called lect18.dart and it is imported into main.dart. Which of the following statements is true?",
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
                { text: "The deposit method is accessible in main.dart.", correct: true, id: 'ws18_dart_q3_opt0' },
                { text: "We can get balance in main.dart.", correct: true, id: 'ws18_dart_q3_opt1' },
                { text: "We can set balance in main.dart.", correct: false, id: 'ws18_dart_q3_opt2' },
                { text: "We can get _balance in main.dart.", correct: false, id: 'ws18_dart_q3_opt3' },
                { text: "We can get _balance in lect18.dart file.", correct: true, id: 'ws18_dart_q3_opt4' }
            ],
            correctAnswers: ['ws18_dart_q3_opt0', 'ws18_dart_q3_opt1', 'ws18_dart_q3_opt4'],
            explanation: "`deposit` is public. The getter `balance` is public. There's no public setter for `balance`. `_balance` is library-private, accessible within `lect18.dart` but not directly from `main.dart` (if it's a different library)."
        },
        { // ws18_dart_q5 was missing, this is the original q6
            id: 'ws18_dart_q4_placeholder',
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
                { text: "Only Dog objects have a name instance variable.", correct: false, id: 'ws18_dart_q4_opt0' },
                { text: "All Dog objects have a bark method.", correct: true, id: 'ws18_dart_q4_opt1' },
                { text: "The toString method in Dog overrides toString of Animal.", correct: true, id: 'ws18_dart_q4_opt2' },
                { text: "The super keyword is used to call the eat method in Animal.", correct: false, id: 'ws18_dart_q4_opt3' },
                { text: "The Animal class cannot be instantiated (you can only create Dog objects).", correct: false, id: 'ws18_dart_q4_opt4' }
            ],
            correctAnswers: ['ws18_dart_q4_opt1', 'ws18_dart_q4_opt2'],
            explanation: "`Dog` inherits `name`. `Dog` defines the `bark` method. `Dog.toString` overrides `Animal.toString`. `super` in `Dog`'s constructor calls `Animal`'s constructor. `Animal` is a concrete class and can be instantiated."
        }
    ];

    // Console log for debugging (can be removed in production if desired)
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
                    const escapedCode = q.code ? escapeHTML(q.code) : '';
                    questionHTML += `<pre class="code-block"><code>${escapedCode}</code></pre>`;
                }

                questionHTML += `<div class="options-container">`;
                if (q.options && (q.type === 'multiple-choice' || q.type === 'code-snippet')) {
                    q.options.forEach((opt) => {
                        questionHTML += 
                            `<label>` +
                                `<input type="radio" name="question${q.id}" value="${escapeHTML(opt.text)}"> ` +
                                `${escapeHTML(opt.text)}` +
                            `</label>`;
                    });
                } else if (q.options && q.type === 'multiple-select') {
                    q.options.forEach((opt) => {
                        questionHTML += 
                            `<label>` +
                                `<input type="checkbox" name="question${q.id}" value="${escapeHTML(opt.text)}" data-option-id="${opt.id}">` +
                                ` ${escapeHTML(opt.text)}` +
                            `</label>`;
                    });
                }
                questionHTML += `</div>`; // options-container
                questionHTML += `<div class="explanation" style="display:none;"><p><strong>Explanation:</strong> ${escapeHTML(q.explanation)}</p></div>`;
                questionHTML += `</div>`; // question-card
            });
        } catch (error) {
            console.error("Error during HTML generation in renderQuestions:", error);
            questionHTML += "<p style='color:red;'>An error occurred while rendering some questions.</p>";
        }
        examContainer.innerHTML = questionHTML;
    }

    function handleSubmit() {
        console.log("handleSubmit: Function started.");
        clearInterval(timerInterval);
        let score = 0; 
        let detailedFeedbackHTML = '';

        currentQuestions.forEach((q, index) => {
            console.log(`handleSubmit: Processing question ID ${q.id}, type ${q.type}`);
            const questionCard = document.getElementById(`question-${index}`);
            detailedFeedbackHTML += `<div class="feedback-question-block">`;
            detailedFeedbackHTML += `<h4>Question ${index + 1}: ${escapeHTML(q.text)}</h4>`; 

            if (q.code) {
                 const escapedCode = q.code ? escapeHTML(q.code) : '';
                 detailedFeedbackHTML += `<pre class="code-block feedback-code"><code>${escapedCode}</code></pre>`;
            }

            let isQuestionCorrectOverall = false; 
            let answered = false;
            let userAnswerDisplayText = ''; 
            
            let ms_correctlySelectedCount = 0;
            let ms_incorrectSelectionsMadeText = [];
            let ms_isPerfectScore = false;
            let ms_totalCorrectOptions = 0;


            if (q.type === 'multiple-choice' || q.type === 'code-snippet') {
                const selectedOptionInput = document.querySelector(`input[name="question${q.id}"]:checked`);
                if (selectedOptionInput) {
                    answered = true;
                    const userAnswerValue = selectedOptionInput.value; 
                    userAnswerDisplayText = userAnswerValue; 

                    const correctOption = q.options.find(opt => opt.correct === true);
                    if (correctOption) {
                        if (userAnswerValue === escapeHTML(correctOption.text)) { 
                            score++; 
                            isQuestionCorrectOverall = true;
                        }
                    } else {
                        console.error(`Error: No correct option defined for MC question ID ${q.id}!`);
                    }
                } else {
                    userAnswerDisplayText = "No answer selected.";
                }
                detailedFeedbackHTML += `<p><strong>Your answer:</strong> ${userAnswerDisplayText}</p>`;

                const correctOptionData = q.options.find(opt => opt.correct);
                if (correctOptionData) {
                    detailedFeedbackHTML += `<p><strong>Correct answer:</strong> <span class="correct-answer-text">${escapeHTML(correctOptionData.text)}</span></p>`;
                }

            } else if (q.type === 'multiple-select') {
                const selectedCheckboxes = document.querySelectorAll(`input[name="question${q.id}"]:checked`);
                let selectedIds = [];
                let selectedEscapedTexts = [];
                
                if (selectedCheckboxes.length > 0) answered = true;

                selectedCheckboxes.forEach(cb => {
                    selectedIds.push(cb.dataset.optionId);
                    selectedEscapedTexts.push(cb.value);
                });

                userAnswerDisplayText = selectedEscapedTexts.length > 0 ? selectedEscapedTexts.join(', ') : "No answer selected.";
                detailedFeedbackHTML += `<p><strong>Your answer:</strong> ${userAnswerDisplayText}</p>`;

                const correctOptionIds = q.correctAnswers || [];
                const allOptionObjects = q.options || [];
                ms_totalCorrectOptions = correctOptionIds.length;

                if (ms_totalCorrectOptions === 0 && answered) {
                    console.warn(`handleSubmit MS: No correctAnswers defined for question ${q.id} but it was answered.`);
                }

                correctOptionIds.forEach(correctId => {
                    if (selectedIds.includes(correctId)) {
                        ms_correctlySelectedCount++;
                    }
                });

                selectedIds.forEach(selectedId => {
                    if (!correctOptionIds.includes(selectedId)) {
                        const incorrectOption = allOptionObjects.find(opt => opt.id === selectedId);
                        if (incorrectOption) {
                            ms_incorrectSelectionsMadeText.push(escapeHTML(incorrectOption.text));
                        }
                    }
                });
                
                ms_isPerfectScore = (ms_correctlySelectedCount === ms_totalCorrectOptions && ms_incorrectSelectionsMadeText.length === 0 && ms_totalCorrectOptions > 0);
                
                if (ms_correctlySelectedCount > 0) {
                    isQuestionCorrectOverall = true; 
                }
                
                if (ms_isPerfectScore) {
                    score++; 
                }
                
                if (answered) {
                    if (ms_isPerfectScore) {
                         detailedFeedbackHTML += `<p class="feedback-status correct-feedback">Perfect! All your selections were correct.</p>`;
                    } else if (ms_correctlySelectedCount > 0) {
                        let feedbackMsg = `<p class="feedback-status partially-correct">You correctly selected ${ms_correctlySelectedCount} of the ${ms_totalCorrectOptions} correct option(s).`;
                        if (ms_incorrectSelectionsMadeText.length > 0) {
                            feedbackMsg += ` <span class="incorrect-selection-note">Incorrectly selected: ${ms_incorrectSelectionsMadeText.join(', ')}.</span>`;
                        }
                        feedbackMsg += `</p>`;
                        detailedFeedbackHTML += feedbackMsg;
                    } else { 
                        detailedFeedbackHTML += `<p class="feedback-status incorrect-feedback">None of your selected options were correct.`;
                        if (ms_incorrectSelectionsMadeText.length > 0) { 
                            detailedFeedbackHTML += ` <span class="incorrect-selection-note">You selected: ${ms_incorrectSelectionsMadeText.join(', ')}.</span>`;
                        }
                        detailedFeedbackHTML += `</p>`;
                    }
                } else {
                     detailedFeedbackHTML += `<p class="feedback-status unanswered-feedback">You did not answer this question.</p>`;
                }

                const correctOptionsDisplayTexts = allOptionObjects
                    .filter(opt => correctOptionIds.includes(opt.id))
                    .map(opt => escapeHTML(opt.text))
                    .join(', ');
                detailedFeedbackHTML += `<p><strong>All correct answer(s):</strong> <span class="correct-answer-text">${correctOptionsDisplayTexts}</span></p>`;
            }

            if (questionCard) {
                questionCard.classList.remove('correct', 'incorrect', 'unanswered', 'partially-correct');
                if (q.type === 'multiple-select') {
                    if (answered) {
                        if (ms_isPerfectScore) {
                            questionCard.classList.add('correct'); 
                        } else if (ms_correctlySelectedCount > 0) {
                            questionCard.classList.add('partially-correct'); 
                        } else {
                            questionCard.classList.add('incorrect'); 
                        }
                    } else {
                        questionCard.classList.add('unanswered');
                    }
                } else { 
                    if (isQuestionCorrectOverall && answered) {
                        questionCard.classList.add('correct');
                    } else if (answered) {
                        questionCard.classList.add('incorrect');
                    } else {
                        questionCard.classList.add('unanswered');
                    }
                }
                // console.log(`handleSubmit: Applied classes to card for q=${q.id}: ${questionCard.className}`);

                const explanationDiv = questionCard.querySelector('.explanation');
                if (explanationDiv) {
                    explanationDiv.style.display = 'block'; 
                }
            }
            detailedFeedbackHTML += `<div class="explanation-feedback"><p><strong>Explanation:</strong> ${escapeHTML(q.explanation)}</p></div>`;
            detailedFeedbackHTML += `</div>`; 
            if (index < currentQuestions.length - 1) { 
                detailedFeedbackHTML += `<hr class="feedback-divider">`;
            }
        });
        console.log("handleSubmit: Loop finished. Score calculated:", score);

        if(scoreDisplay) scoreDisplay.textContent = `${score.toFixed(2)} out of ${currentQuestions.length}`;
        if(feedbackArea) feedbackArea.innerHTML = detailedFeedbackHTML;
        if(resultsContainer) {
            resultsContainer.style.display = 'block';
            console.log("handleSubmit: resultsContainer displayed.");
        }
        if(submitButton) {
            submitButton.style.display = 'none';
        }
        if(examContainer) {
            examContainer.style.display = 'none';
            console.log("handleSubmit: examContainer hidden.");
        }
        console.log("handleSubmit: Function finished.");
    }

    function startExam() { 
        if (!examInitiationArea || !examArea || !resultsContainer || !examContainer || !submitButton) {
            console.error("One or more critical DOM elements are missing. Check HTML IDs.");
            return;
        }
        console.log('--- Starting Main Mock Exam ---');
        
        examInitiationArea.style.display = 'none';
        examArea.style.display = 'block';
        resultsContainer.style.display = 'none';
        examContainer.style.display = 'block'; 
        submitButton.style.display = 'block';
        submitButton.disabled = false;

        currentQuestions = [...allQuestions]; 
        console.log('Loaded allQuestions. currentQuestions length:', currentQuestions.length);
        
        shuffleArray(currentQuestions);
        console.log('After shuffle. currentQuestions length:', currentQuestions.length);
        
        console.log('Final currentQuestions length BEFORE calling renderQuestions:', currentQuestions.length);

        if (currentQuestions.length === 0) {
            if(examContainer) examContainer.innerHTML = "<p>No questions available. Please ensure 'allQuestions' array is populated.</p>";
            if(submitButton) submitButton.style.display = 'none';
            clearInterval(timerInterval);
            if (timerDisplay) timerDisplay.textContent = "--:--";
            console.log('No questions to render.');
            return;
        }
        
        renderQuestions();
        let timePerQuestion = 90; 
        startTimer(currentQuestions.length * timePerQuestion);
        console.log('--- Main Mock Exam Started ---');
    }

    // --- Event Listeners ---
    if (startExamButton) startExamButton.addEventListener('click', startExam);
    if (submitButton) submitButton.addEventListener('click', handleSubmit);
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            if (examArea) examArea.style.display = 'none';
            if (resultsContainer) resultsContainer.style.display = 'none';
            if (examInitiationArea) examInitiationArea.style.display = 'block';
            
            clearInterval(timerInterval);
            if (timerDisplay) timerDisplay.textContent = "--:--";
            if(scoreDisplay) scoreDisplay.textContent = '';
            if(feedbackArea) feedbackArea.innerHTML = '';
            
            if(examContainer) {
                examContainer.innerHTML = '';
            }
        });
    }
});