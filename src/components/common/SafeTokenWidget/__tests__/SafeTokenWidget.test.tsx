import * as useBalances from '@/hooks/useBalances'
import * as nextRouter from 'next/router'
import useChainId from '@/hooks/useChainId'
import { render, waitFor } from '@/tests/test-utils'
import { SafeAppAccessPolicyTypes } from '@gnosis.pm/safe-react-gateway-sdk'
import { BigNumber } from 'ethers'
import SafeTokenWidget from '..'
import { hexZeroPad } from 'ethers/lib/utils'
import { AppRoutes } from '@/config/routes'
import useSafeTokenAllocation from '@/hooks/useSafeTokenAllocation'

const MOCK_CLAIMING_APP_URL = 'https://fake.claiming-app.safe.global'

jest.mock('@/hooks/useChainId', () => jest.fn(() => '1'))

jest.mock('@/hooks/useSafeTokenAllocation')

jest.mock(
  '@/hooks/safe-apps/useRemoteSafeApps',
  jest.fn(() => ({
    useRemoteSafeApps: () => [
      [
        {
          id: 61,
          url: MOCK_CLAIMING_APP_URL,
          chainIds: ['4'],
          name: '$SAFE Claiming App',
          description: '',
          iconUrl: '',
          tags: ['safe-claiming-app'],
          accessControl: {
            type: SafeAppAccessPolicyTypes.NoRestrictions,
          },
        },
      ],
    ],
  })),
)

describe('SafeTokenWidget', () => {
  const fakeSafeAddress = hexZeroPad('0x1', 20)
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.spyOn(nextRouter, 'useRouter').mockImplementation(
      () =>
        ({
          query: {
            safe: fakeSafeAddress,
          },
        } as any),
    )
  })

  it('Should render nothing for unsupported chains', () => {
    ;(useChainId as jest.Mock).mockImplementationOnce(jest.fn(() => '100'))

    jest.spyOn(useBalances, 'default').mockImplementation(() => ({
      balances: {
        fiatTotal: '0',
        items: [],
      },
      loading: true,
      error: undefined,
    }))

    const result = render(<SafeTokenWidget />)
    expect(result.baseElement).toContainHTML('<body><div /></body>')
  })

  it('Should display 0 if Safe has no SAFE token', async () => {
    ;(useSafeTokenAllocation as jest.Mock).mockImplementation(() => BigNumber.from(0))

    const result = render(<SafeTokenWidget />)
    await waitFor(() => expect(result.baseElement).toHaveTextContent('0'))
  })

  it('Should display the value formatted correctly', async () => {
    ;(useSafeTokenAllocation as jest.Mock).mockImplementation(() => BigNumber.from('472238796133701648384'))

    // to avoid failing tests in some environments
    const NumberFormat = Intl.NumberFormat
    const englishTestLocale = 'en'

    jest.spyOn(Intl, 'NumberFormat').mockImplementation((_, ...rest) => new NumberFormat([englishTestLocale], ...rest))

    const result = render(<SafeTokenWidget />)
    await waitFor(() => {
      expect(result.baseElement).toHaveTextContent('472.24')
      expect(result.baseElement).not.toHaveTextContent('472.2388')
    })
  })

  it('Should render a link to the claiming app', async () => {
    ;(useSafeTokenAllocation as jest.Mock).mockImplementation(() => BigNumber.from(420000))

    const result = render(<SafeTokenWidget />)
    await waitFor(() => {
      expect(result.baseElement).toContainHTML(
        `href="${AppRoutes.apps}?safe=${fakeSafeAddress}&appUrl=${encodeURIComponent(MOCK_CLAIMING_APP_URL)}"`,
      )
    })
  })
})
