import { describe, it, expect, vi, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import ResumePage from './page'

// Mock resume data
const mockResumeData = {
  name: 'Richard Hudson',
  title: 'Revenue Operations Specialist',
  email: 'test@example.com',
  phone: '',
  location: 'Plano, Texas',
  summary: 'Test summary',
  workExperience: [],
  education: [],
  skills: [],
  certifications: [],
}

// Mock getResumeData
vi.mock('@/types/resume', () => ({
  getResumeData: () => mockResumeData,
}))

// Mock layout components
vi.mock('@/components/layout/navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}))

vi.mock('@/components/layout/footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))

// Mock new resume components
vi.mock('./_components/HeroHeader', () => ({
  HeroHeader: () => (
    <div data-testid="hero-section">
      <h1>Richard Hudson</h1>
      <button data-testid="toggle-pdf">View PDF</button>
    </div>
  ),
}))

vi.mock('./_components/AboutSection', () => ({
  AboutSection: () => <div data-testid="career-metrics">About Section</div>,
}))

vi.mock('./_components/ExperienceSection', () => ({
  ExperienceSection: () => <div data-testid="work-experience">Experience Section</div>,
}))

vi.mock('./_components/EducationCertifications', () => ({
  EducationCertifications: () => <div data-testid="education-section">Education & Certifications</div>,
}))

vi.mock('./_components/SkillsSection', () => ({
  SkillsSection: () => <div data-testid="skills">Skills Section</div>,
}))

// Mock resume-viewer (dynamically imported)
vi.mock('./resume-viewer', () => ({
  ResumeViewer: ({ pdfUrl }: { pdfUrl: string }) => (
    <div data-testid="pdf-viewer">PDF Viewer: {pdfUrl}</div>
  ),
}))

// Mock logger
mock.module('@/lib/monitoring/logger', () => ({
  createContextLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}))

describe('Resume Page', () => {
  it('renders without crashing', () => {
    render(<ResumePage />)
    expect(screen.getByTestId('navbar')).toBeDefined()
    expect(screen.getByTestId('footer')).toBeDefined()
  })

  it('shows resume sections by default', () => {
    render(<ResumePage />)
    const main = screen.getByRole('main')
    expect(main).toBeDefined()

    // Check that resume sections are visible
    expect(screen.getByTestId('hero-section')).toBeDefined()
    expect(screen.getByTestId('career-metrics')).toBeDefined()
    expect(screen.getByTestId('work-experience')).toBeDefined()
    expect(screen.getByTestId('education-section')).toBeDefined()
    expect(screen.getByTestId('skills')).toBeDefined()
  })

  it('renders hero section with resume data', () => {
    render(<ResumePage />)
    expect(screen.getByTestId('hero-section')).toBeDefined()
    expect(screen.getByText('Richard Hudson')).toBeDefined()
    expect(screen.getByTestId('toggle-pdf')).toBeDefined()
  })
})
