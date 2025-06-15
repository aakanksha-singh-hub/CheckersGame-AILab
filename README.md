# Checkers AI Lab

This is a research project exploring AI algorithms in the game of Checkers, focusing on a comparison between the Minimax algorithm and Reinforcement Learning (Q-Learning).

## Project Overview

This platform provides an interactive environment to:

*   Play Checkers against different AI opponents (Minimax and Q-Learning).
*   Observe AI vs AI gameplay (Minimax vs. Q-Learning).
*   Learn about the theoretical foundations and implementation details of these AI algorithms.
*   Analyze performance metrics and compare the strategies of the different AI approaches.

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (Node Package Manager)

### Installation

1.  Clone the repository:

    ```bash
    git clone <your-repo-url>
    cd ai-checkers-lab-main
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8081/` (or another port if 8081 is in use).

## Project Structure

*   `src/`: Contains the main application source code.
    *   `components/`: React components for the UI.
    *   `lib/game/`: Core game logic and AI algorithms (Minimax, Q-Learning).
    *   `pages/`: React components for different application pages (Play, Compare, Learn, About).
*   `public/`: Static assets.
*   `vite.config.ts`: Vite build configuration.
*   `package.json`: Project dependencies and scripts.

## AI Algorithms

### Minimax

A classic tree-search algorithm for decision-making in two-player games, assuming optimal play from both sides.

### Q-Learning

A model-free reinforcement learning algorithm that learns optimal policies through trial and error.

## Contributions

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.
