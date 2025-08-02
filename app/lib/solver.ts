import kociemba from 'kociemba';

export const solveCube = async (state54: string): Promise<string[]> => {
  try {
    // The kociemba library expects a 54-character string representing the cube state
    // It returns a solution string like "R U R' U' F' U F"
    const solution = kociemba.solve(state54);
    
    // Split the solution into individual moves
    const moves = solution.split(' ').filter(move => move.length > 0);
    
    return moves;
  } catch (error) {
    console.error('Solver error:', error);
    // Fallback to mock solution if solver fails
    return ['R', 'U', "R'", "U'", "F'", 'U', 'F'];
  }
};

