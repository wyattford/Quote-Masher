﻿# Quote Masher

A self-hosted quote mashing bot which takes inspirational quotes from famous individuals and used machine learning to combine them. The quotes are all hand selected, and Meta's Llama 3.2 model is used to combine them.

## Requirements

- An Ollama server running locally
- Hardware to run the LLM and main program (16+ GB RAM, 8+ GB VRAM recommended)
- ~4GB of storage space
- A Bluesky social account

## Setup

- Clone the repository
- Create .env file with IDENTIFIER and PASSWORD fields holding the Bluesky account login details
- Install Ollama and download Llama 3.2 (Other models can be used, change the chosenModel constant in app.js)
- Start Ollama service. The program will dynamically load and unload models from memory as needed
- Run app.js
