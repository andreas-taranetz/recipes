/**
 * Voice Control for Recipe Pages
 * Handles German voice recognition to check off ingredients
 */

export class VoiceControl {
	constructor() {
		this.recognition = null;
		this.isListening = false;
		this.ingredients = [];
		this.steps = [];
	}

	/**
	 * Initialize the voice recognition with German language
	 */
	init() {
		if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
			console.error("Speech recognition not supported");
			return false;
		}

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		this.recognition = new SpeechRecognition();
		this.recognition.lang = "de-DE";
		this.recognition.continuous = true;
		this.recognition.interimResults = false;

		this.recognition.onresult = (event) => {
			const last = event.results.length - 1;
			const transcript = event.results[last][0].transcript.toLowerCase().trim();
			console.log("Recognized:", transcript);
			this.handleVoiceCommand(transcript);
		};

		this.recognition.onerror = (event) => {
			console.error("Speech recognition error:", event.error);
		};

		this.recognition.onend = () => {
			if (this.isListening) {
				// Restart recognition if it ends but we're still listening
				this.recognition.start();
			}
		};

		return true;
	}

	/**
	 * Collect all ingredients and steps from the page
	 */
	collectIngredients() {
		this.ingredients = [];
		const ingredientsList = document.querySelector(".ingredients");
		if (!ingredientsList) return;

		const items = ingredientsList.querySelectorAll("li");
		items.forEach((li, index) => {
			const label = li.querySelector("label");
			const checkbox = li.querySelector('input[type="checkbox"]');
			if (label && checkbox) {
				this.ingredients.push({
					text: label.textContent.toLowerCase().trim(),
					checkbox: checkbox,
					index: index,
				});
			}
		});
	}

	/**
	 * Collect all steps from the page
	 */
	collectSteps() {
		this.steps = [];
		const stepsList = document.querySelector(".steps");
		if (!stepsList) return;

		const items = stepsList.querySelectorAll("li");
		items.forEach((li, index) => {
			const radio = li.querySelector('input[type="radio"]');
			if (radio) {
				this.steps.push({
					radio: radio,
					index: index,
				});
			}
		});
	}

	/**
	 * Handle voice command by checking if it matches any ingredient or step command
	 */
	handleVoiceCommand(transcript) {
		// Check for ingredient matches
		this.ingredients.forEach((ingredient) => {
			// Extract key words from ingredient (numbers, units, and special characters removed)
			const ingredientWords = ingredient.text
				.replace(/\d+/g, "") // Remove numbers
				.replace(/\b(ml|g|tl|el|prise|kg|l)\b/gi, "") // Remove common units
				.replace(/[()]/g, "") // Remove parentheses
				.split(/\s+/)
				.filter((word) => word.length > 2); // Keep words longer than 2 chars

			// Check if any significant word from ingredient appears in transcript
			const matchFound = ingredientWords.some((word) => transcript.includes(word));

			if (matchFound && !ingredient.checkbox.checked) {
				console.log("Checking off ingredient:", ingredient.text);
				ingredient.checkbox.checked = true;
				// Trigger change event for any listeners
				ingredient.checkbox.dispatchEvent(new Event("change", { bubbles: true }));
			}
		});

		// Check for step navigation commands
		if (transcript.includes("nächster schritt") || transcript.includes("weiter")) {
			this.advanceStep();
		} else if (transcript.includes("zurück") || transcript.includes("vorheriger schritt")) {
			this.previousStep();
		}
	}

	/**
	 * Advance to the next step
	 */
	advanceStep() {
		const currentStepIndex = this.steps.findIndex((step) => step.radio.checked);
		const nextIndex = currentStepIndex + 1;

		if (nextIndex < this.steps.length) {
			console.log("Advancing to step:", nextIndex + 1);
			this.steps[nextIndex].radio.checked = true;
			// Trigger change event
			this.steps[nextIndex].radio.dispatchEvent(new Event("change", { bubbles: true }));
		}
	}

	/**
	 * Go back to the previous step
	 */
	previousStep() {
		const currentStepIndex = this.steps.findIndex((step) => step.radio.checked);
		const prevIndex = currentStepIndex - 1;

		if (prevIndex >= 0) {
			console.log("Going back to step:", prevIndex + 1);
			this.steps[prevIndex].radio.checked = true;
			// Trigger change event
			this.steps[prevIndex].radio.dispatchEvent(new Event("change", { bubbles: true }));
		}
	}

	/**
	 * Start listening to voice commands
	 */
	start() {
		if (!this.recognition) {
			if (!this.init()) {
				alert("Spracherkennung wird von Ihrem Browser nicht unterstützt.");
				return false;
			}
		}

		this.collectIngredients();
		this.collectSteps();

		try {
			this.recognition.start();
			this.isListening = true;
			console.log("Voice recognition started");
			return true;
		} catch (error) {
			console.error("Error starting recognition:", error);
			return false;
		}
	}

	/**
	 * Stop listening to voice commands
	 */
	stop() {
		if (this.recognition && this.isListening) {
			this.isListening = false;
			this.recognition.stop();
			console.log("Voice recognition stopped");
		}
	}

	/**
	 * Toggle voice recognition on/off
	 */
	toggle() {
		if (this.isListening) {
			this.stop();
			return false;
		} else {
			return this.start();
		}
	}
}
