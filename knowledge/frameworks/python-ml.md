# Python ML/AI Framework Guide

## Overview

Python machine learning and AI projects have specific needs for data handling, model management, and experiment tracking.

## Recommended MCPs

- **context7** (essential) - Library documentation (pandas, sklearn, torch)
- **memory** (essential) - Track experiments and decisions
- **filesystem** (essential) - Data and model file operations
- **sequential-thinking** (essential) - Complex algorithm reasoning
- **postgres/sqlite** (recommended) - Data storage

## CLAUDE.md Template for Python ML

```markdown
# CLAUDE.md

## Project Overview

Python ML project for [purpose]. Uses [main framework: PyTorch/TensorFlow/sklearn].

## Tech Stack

- **Language**: Python 3.10+
- **ML Framework**: [PyTorch/TensorFlow/scikit-learn]
- **Data**: pandas, numpy
- **Visualization**: matplotlib, seaborn
- **Experiment Tracking**: [MLflow/Weights & Biases/none]

## Project Structure

- `src/` - Source code
  - `data/` - Data loading and preprocessing
  - `models/` - Model definitions
  - `training/` - Training loops and utilities
  - `evaluation/` - Metrics and evaluation
- `notebooks/` - Jupyter notebooks for exploration
- `data/` - Raw and processed data (gitignored)
- `models/` - Saved model checkpoints (gitignored)
- `tests/` - Unit tests

## Coding Conventions

- Use type hints for all functions
- Prefer dataclasses for configuration
- Use pathlib for file paths
- Document functions with docstrings
- Keep notebooks for exploration, scripts for production

## Environment

- Use virtual environment (venv or conda)
- Pin dependencies in requirements.txt
- Separate dev and prod requirements

## Common Commands

- `python -m venv venv` - Create virtual environment
- `pip install -r requirements.txt` - Install dependencies
- `python src/train.py` - Run training
- `pytest tests/` - Run tests
- `jupyter notebook` - Start Jupyter
```

## Key Patterns

### Type Hints

```python
from typing import List, Optional, Tuple
import numpy as np
from numpy.typing import NDArray

def preprocess_data(
    data: NDArray[np.float64],
    normalize: bool = True
) -> Tuple[NDArray[np.float64], dict]:
    """Preprocess input data.
    
    Args:
        data: Input array of shape (n_samples, n_features)
        normalize: Whether to normalize the data
        
    Returns:
        Tuple of processed data and metadata dict
    """
    ...
```

### Configuration with Dataclasses

```python
from dataclasses import dataclass
from pathlib import Path

@dataclass
class TrainingConfig:
    learning_rate: float = 0.001
    batch_size: int = 32
    epochs: int = 100
    model_path: Path = Path("models/")
    
config = TrainingConfig(learning_rate=0.0001)
```

### Reproducibility

```python
import random
import numpy as np
import torch

def set_seed(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
```

## Common Mistakes to Avoid

1. Not setting random seeds for reproducibility
2. Data leakage between train/test sets
3. Not versioning data and models
4. Hardcoding paths instead of using config
5. Training in notebooks instead of scripts
6. Not tracking experiments systematically
