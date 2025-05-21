import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import PerfChart from '../components/PerfChart';
import PreferencesModal from '../components/PreferencesModal';
import '../styles/LandingPage.style.css';
import projectService from '../services/project.service';
import { toast } from 'react-toastify';
import abcIterationsFitness from '../assets/data/ABC/Iterations_960_Fitness.csv';
import abcIterationsTime from '../assets/data/ABC/Iterations_960_Time.csv';
import abcLimitFitness from '../assets/data/ABC/Limit_960_Fitness.csv';
import abcLimitTime from '../assets/data/ABC/Limit_960_Time.csv';

import geneticGenerationsFitness from '../assets/data/Genetic/Generations_960_Fitness.csv';
import geneticGenerationsTime from '../assets/data/Genetic/Generations_960_Time.csv';
import geneticMutationFitness from '../assets/data/Genetic/Mutation_960_Fitness.csv';
import geneticMutationTime from '../assets/data/Genetic/Mutation_960_Time.csv';

export default function LandingPage() {
  const [code, setCode] = useState('');
  const [heroVisible, setHeroVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingErrors, setLoadingErrors] = useState([]);
  const [algorithmData, setAlgorithmData] = useState({
    beeColony: {
      performance: [],
      timeComplexity: [],
      metricFitness: [],
      metricTime: [],
    },
    genetic: {
      performance: [],
      timeComplexity: [],
      metricFitness: [],
      metricTime: [],
    },
  });
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const chartConfigs = {
    beeColony: [
      {
        metric: 'performance',
        title: 'Iteration vs Fitness',
        xKey: 'x',
        yKey: 'y',
        xLabel: 'Iteration',
        yLabel: 'Fitness',
        domain: [980, 990],
      },
      {
        metric: 'timeComplexity',
        title: 'Iteration vs Time (ms)',
        xKey: 'x',
        yKey: 'y',
        xLabel: 'Iteration',
        yLabel: 'Time (ms)',
        domain: [0, 450],
      },
      {
        metric: 'metricFitness',
        title: 'Limit vs Fitness',
        xKey: 'x',
        yKey: 'y',
        xLabel: 'Limit',
        yLabel: 'Fitness',
        domain: ['auto', 'auto'],
      },
      {
        metric: 'metricTime',
        title: 'Limit vs Time (ms)',
        xKey: 'x',
        yKey: 'y',
        xLabel: 'Limit',
        yLabel: 'Time (ms)',
        domain: ['auto', 'auto'],
      },
    ],
    genetic: [
      {
        metric: 'performance',
        title: 'Generation vs Fitness',
        xKey: 'x',
        yKey: 'y',
        xLabel: 'Generation',
        yLabel: 'Fitness',
        domain: ['auto', 'auto'],
      },
      {
        metric: 'timeComplexity',
        title: 'Generation vs Time (ms)',
        xKey: 'x',
        yKey: 'y',
        xLabel: 'Generation',
        yLabel: 'Time (ms)',
        domain: [0, 'auto'],
      },
      {
        metric: 'metricFitness',
        title: 'Mutation (%) vs Fitness',
        xKey: 'x',
        yKey: 'y',
        xLabel: 'Mutation (%)',
        yLabel: 'Fitness',
        domain: ['auto', 'auto'],
      },
      {
        metric: 'metricTime',
        title: 'Mutation (%) vs Time (ms)',
        xKey: 'x',
        yKey: 'y',
        xLabel: 'Mutation (%)',
        yLabel: 'Time (ms)',
        domain: ['auto', 'auto'],
      },
    ],
  };

  useEffect(() => {
    loadCSVData();
    setHeroVisible(true);
    createFallingElements();
  }, []);

  const loadCSVData = async () => {
    setIsLoading(true);
    setLoadingErrors([]);

    const beeFiles = {
      performance: abcIterationsFitness,
      timeComplexity: abcIterationsTime,
      metricFitness: abcLimitFitness,
      metricTime: abcLimitTime,
    };
    const genFiles = {
      performance: geneticGenerationsFitness,
      timeComplexity: geneticGenerationsTime,
      metricFitness: geneticMutationFitness,
      metricTime: geneticMutationTime,
    };

    const transformData = (rows) =>
      rows
        .filter((r) => r && Object.keys(r).length)
        .map((r) => {
          const [x, y] = Object.values(r);
          return { x: Number(x), y: Number(y) };
        })
        .filter((pt) => !isNaN(pt.x) && !isNaN(pt.y));

    const loadOne = (url) =>
      new Promise((res, rej) => {
        Papa.parse(url, {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: ({ data, errors }) => {
            if (errors.length) return rej(errors[0]);
            const transformed = transformData(data);
            if (!transformed.length) return rej(new Error('no valid rows'));
            res(transformed);
          },
          error: rej,
        });
      });

    // build two arrays of promises
    const beePromises = Object.entries(beeFiles).map(async ([m, u]) => {
      try {
        const d = await loadOne(u);
        setAlgorithmData((p) => ({
          ...p,
          beeColony: { ...p.beeColony, [m]: d },
        }));
      } catch (err) {
        setLoadingErrors((prev) => [...prev, `BeeColony ${m}: ${err.message}`]);
      }
    });
    const genPromises = Object.entries(genFiles).map(async ([m, u]) => {
      try {
        const d = await loadOne(u);
        setAlgorithmData((p) => ({
          ...p,
          genetic: { ...p.genetic, [m]: d },
        }));
      } catch (err) {
        setLoadingErrors((prev) => [...prev, `Genetic ${m}: ${err.message}`]);
      }
    });

    await Promise.all([...beePromises, ...genPromises]);
    setIsLoading(false);
  };

  const createFallingElements = () => {
    const container = document.querySelector('.falling-elements');
    if (!container) return;
    const make = () => {
      const el = document.createElement('div');
      el.className = 'falling-element';
      el.style.left = `${Math.random() * 100}%`;
      el.style.setProperty('--fall-duration', `${10 + Math.random() * 4}s`);
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    };
    for (let i = 0; i < 20; i++) setTimeout(make, i * 500);
    setInterval(() => container.children.length < 8 && make(), 2000);
  };

  const handleJoin = async () => {
    const cleanCode = code.replace('-', '').trim();
    if (!cleanCode) return;

    try {
      setError('');
      const response = await projectService.searchProject(cleanCode);
      if (response.status === 404) {
        toast.error('Project not found');
        return;
      }
      const data = await response.json();
      const { participants, maxPreferences } = data.response;
      if (participants.length === 0) {
        toast.error('No participants found');
        return;
      }
      setProjectData({ participants, maxPreferences });
      setShowPreferencesModal(true);
    } catch (err) {
      toast.error('Failed to find project');
    }
  };

  const handleSubmitPreferences = async () => {
    if (!selectedParticipant || !participantId) {
      setError('Please select yourself and enter your ID');
      return;
    }

    try {
      const response = await projectService.savePreferences(
        selectedParticipant,
        participantId,
        preferences.map((p) => p._id)
      );
      if (response.status === 200) {
        toast.success('Preferences saved successfully');
      } else {
        console.error(await response.json());
        toast.error('Failed to save preferences');
      }

      setShowPreferencesModal(false);
      setSelectedParticipant('');
      setParticipantId('');
      setPreferences([]);
      setProjectData(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save preferences');
    }
  };

  const handleCreate = () => navigate('/signup');

  const renderAlgo = (key) => (
    <section>
      <div>
        {isLoading && <p>Loading charts…</p>}
        {loadingErrors.length > 0 && (
          <ul className="error-list">
            {loadingErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
        <div
          className="performance-graphs"
          data-testid={`performance-charts-${key}`}
        >
          {chartConfigs[key].map((cfg) => (
            <PerfChart
              key={cfg.metric}
              title={cfg.title}
              data={algorithmData[key][cfg.metric]}
              xKey={cfg.xKey}
              yKey={cfg.yKey}
              xLabel={cfg.xLabel}
              yLabel={cfg.yLabel}
              domain={cfg.domain}
              data-testid={`chart-${key}-${cfg.metric}`}
            />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="landing-container">
      {/* Hero */}
      <section
        className={`hero ${heroVisible ? 'hero--visible' : ''}`}
        data-testid="hero-section"
      >
        <div className="hero-background" />
        <div className="falling-elements" />
        <div className="hero-blobs">
          <div className="blob blob--one" />
          <div className="blob blob--two" />
          <div className="blob blob--three" />
          <div className="blob blob--four" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            {'Groupify'.split('').map((ch, i) => (
              <span key={i} className="hero-title__char">
                {ch}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle">
            Seamlessly build and manage collaborative groups
          </p>
          <div className="hero-search">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter project code…"
              maxLength={9}
              data-testid="project-code-input"
            />
            <button
              className="btn-join"
              onClick={handleJoin}
              data-testid="join-button"
            >
              Join Project →
            </button>
          </div>
          <button
            className="btn-create pulse-animation"
            onClick={handleCreate}
            data-testid="create-button"
          >
            Create Your Project
          </button>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow" />
          <div className="scroll-text">About the Algorithms</div>
        </div>
      </section>

      <section
        className="algorithm-section genetic-section"
        data-testid="genetic-algorithm-section"
      >
        <div className="animated-emojis">
          <span className="flying-emoji dna-1">🧬</span>
          <span className="flying-emoji dna-2">🧬</span>
          <span className="flying-emoji dna-3">🧬</span>
          <span className="flying-emoji dna-4">🧬</span>
          <span className="flying-emoji dna-5">🧬</span>
        </div>
        <div className="algorithm-content">
          <h2>Genetic Algorithm</h2>
          <div className="algorithm-description">
            <p className="lead">
              Drawing inspiration from natural evolution, this algorithm evolves
              group assignments over multiple generations. Each solution's
              "fitness" is the total diversity score—combining mean diversity,
              preference matches, and a variance penalty.
            </p>
            <div className="algorithm-steps">
              <h3>How It Works</h3>
              <ol>
                <li>
                  <strong>Initialize</strong> a population of random groupings
                  (one solution per group count).
                </li>
                <li>
                  <strong>Evaluate Fitness</strong> by calling{' '}
                  <code>calculate_diversity</code> on each grouping.
                </li>
                <li>
                  <strong>Select Parents</strong> (top two by fitness) using a
                  max‐heap via <code>heapq.nlargest</code>.
                </li>
                <li>
                  <strong>Crossover</strong> parents to create a child,
                  preserving every student and balancing group sizes.
                </li>
                <li>
                  <strong>Mutate</strong> the child with a given{' '}
                  <code>mutation_rate</code> by swapping two random students.
                </li>
                <li>
                  <strong>Replace</strong> the worst solution if the child's
                  fitness is higher.
                </li>
                <li>
                  <strong>Repeat</strong> steps 2–6 for the specified number of{' '}
                  <code>generations</code>.
                </li>
              </ol>
            </div>
          </div>
          {renderAlgo('genetic')}
        </div>
      </section>

      <section
        className="algorithm-section bee-colony-section"
        data-testid="bee-colony-section"
      >
        <div className="animated-emojis">
          <span className="flying-emoji bee-1">🐝</span>
          <span className="flying-emoji bee-2">🐝</span>
          <span className="flying-emoji bee-3">🐝</span>
          <span className="flying-emoji bee-4">🐝</span>
          <span className="flying-emoji bee-5">🐝</span>
        </div>
        <div className="algorithm-content">
          <h2>Artificial Bee Colony Algorithm</h2>
          <div className="algorithm-description">
            <p className="lead">
              Inspired by the foraging behavior of honey bees, this ABC
              algorithm alternates between local neighborhood searches
              (“employed bees”), probabilistic selection of promising solutions
              (“onlooker bees”), and random explorations when stuck (“scout
              bees”). Each solution's quality is measured by the same
              diversity-plus-preference score.
            </p>
            <div className="algorithm-steps">
              <h3>How It Works</h3>
              <ol>
                <li>
                  <strong>Initialization</strong>: generate{' '}
                  <code>num_groups</code> random solutions via{' '}
                  <code>initialize_groups</code>.
                </li>
                <li>
                  <strong>Employed Bees</strong>: for each solution, call{' '}
                  <code>improve_solution</code> (swap two students); if fitness
                  improves, accept the new solution, otherwise increment its
                  stagnation counter.
                </li>
                <li>
                  <strong>Onlooker Bees</strong>: compute selection
                  probabilities ∝ current fitness, choose solutions by weighted
                  random sampling, and apply <code>improve_solution</code>{' '}
                  again.
                </li>
                <li>
                  <strong>Scout Bees</strong>: for any solution whose stagnation
                  <code>limit</code>, reinitialize it randomly to escape local
                  optima.
                </li>
                <li>
                  <strong>Repeat</strong> employed → onlooker → scout phases for{' '}
                  <code>num_iterations</code>, tracking the global best
                  solution.
                </li>
              </ol>
            </div>
          </div>
          {renderAlgo('beeColony')}
        </div>
      </section>
      <PreferencesModal
        show={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        participants={projectData?.participants || []}
        maxPreferences={projectData?.maxPreferences || 0}
        selectedParticipant={selectedParticipant}
        onSelectParticipant={setSelectedParticipant}
        participantId={participantId}
        onChangeId={(e) => setParticipantId(e.target.value)}
        preferences={preferences}
        onChangePreferences={setPreferences}
        onSubmit={handleSubmitPreferences}
        error={error}
      />
    </div>
  );
}
