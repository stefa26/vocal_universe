function verificar() {
  var inputs = [
    { id: "input1", answer: "apple" },
    { id: "input2", answer: "three" },
    { id: "input3", answer: "pencil" },
    { id: "input4", answer: "shoes" },
    { id: "input5", answer: "cat" },
    { id: "input6", answer: "dog" },
    { id: "input7", answer: "house" },
    { id: "input8", answer: "guitar" }
  ];

  var message = document.getElementById("message");

  
  var isEmpty = inputs.some(function(input) {
    return document.getElementById(input.id).value.trim() === "";
  });

  if (isEmpty) {
    message.textContent = "Por favor, completa todos los campos.";
    message.classList.remove("success");
    message.classList.add("error");
    message.style.display = "block";
    return;
  }

  var isValid = inputs.every(function(input) {
    var userInput = document.getElementById(input.id).value.trim().toLowerCase();
    return userInput === input.answer;
  });

  if (isValid) {
    message.textContent = "Completado correctamente";
    message.classList.remove("error");
    message.classList.add("success");
  } else {
    message.textContent = "Respuesta incorrecta en algún campo. Inténtalo de nuevo.";
    message.classList.remove("success");
    message.classList.add("error");
  }

  message.style.display = "block";
}
