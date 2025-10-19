import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../../components/Layout';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock useAuth hook
vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        profile: {
          firstName: 'Test',
        },
      },
      loading: false,
      logout: vi.fn(),
    }),
  };
});

describe('Layout Component', () => {
  const renderLayout = (children: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should render navigation with all links', () => {
    renderLayout(<div>Test Content</div>);

    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Likes')).toBeInTheDocument();
    expect(screen.getByText('Matches')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should render children content', () => {
    renderLayout(<div>Test Content</div>);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have navigation links with correct hrefs', () => {
    renderLayout(<div>Test Content</div>);

    const discoverLink = screen.getByText('Discover').closest('a');
    const likesLink = screen.getByText('Likes').closest('a');
    const matchesLink = screen.getByText('Matches').closest('a');
    const profileLink = screen.getByText('Profile').closest('a');

    expect(discoverLink).toHaveAttribute('href', '/');
    expect(likesLink).toHaveAttribute('href', '/likes');
    expect(matchesLink).toHaveAttribute('href', '/matches');
    expect(profileLink).toHaveAttribute('href', '/profile');
  });
});

