import React, { useMemo, useState } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'

const englandBands = [
  { band: 'A', min: 0, max: 40000, label: 'Up to £40,000' },
  { band: 'B', min: 40001, max: 52000, label: '£40,001 to £52,000' },
  { band: 'C', min: 52001, max: 68000, label: '£52,001 to £68,000' },
  { band: 'D', min: 68001, max: 88000, label: '£68,001 to £88,000' },
  { band: 'E', min: 88001, max: 120000, label: '£88,001 to £120,000' },
  { band: 'F', min: 120001, max: 160000, label: '£120,001 to £160,000' },
  { band: 'G', min: 160001, max: 320000, label: '£160,001 to £320,000' },
  { band: 'H', min: 320001, max: Infinity, label: 'More than £320,000' },
]

const averagePriceByYear = {
  1995: 61200,
  1996: 63200,
  1997: 67200,
  1998: 73300,
  1999: 81800,
  2000: 91500,
  2001: 101200,
  2002: 113100,
  2003: 130000,
  2004: 149500,
  2005: 160800,
  2006: 170400,
  2007: 183200,
  2008: 180300,
  2009: 162500,
  2010: 169000,
  2011: 166500,
  2012: 167800,
  2013: 176500,
  2014: 191000,
  2015: 205500,
  2016: 220500,
  2017: 238000,
  2018: 242500,
  2019: 246500,
  2020: 256500,
  2021: 281500,
  2022: 301000,
  2023: 293500,
  2024: 289500,
  2025: 286800,
}

const april1991Benchmark = 48600

function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)
}

function getBandForValue(value) {
  return englandBands.find((band) => value >= band.min && value <= band.max) ?? englandBands[englandBands.length - 1]
}

function SectionHeading({ caption, title, children }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#505a5f]">{caption}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0b0c0c] md:text-4xl">{title}</h2>
      <div className="mt-4 text-lg leading-8 text-[#0b0c0c]">{children}</div>
    </div>
  )
}

function ButtonLink({ href, children, external = false, secondary = false }) {
  const className = secondary
    ? 'inline-flex items-center gap-2 border border-[#0b0c0c] bg-white px-5 py-3 font-bold text-[#0b0c0c] transition hover:bg-[#f3f2f1]'
    : 'inline-flex items-center gap-2 bg-[#1d70b8] px-5 py-3 font-bold text-white transition hover:bg-[#003078]'

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={className}
    >
      {children}
      {external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
    </a>
  )
}

export default function App() {
  const [purchaseDate, setPurchaseDate] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')

  const estimate = useMemo(() => {
    if (!purchaseDate || !purchasePrice) return null

    const parsedPrice = Number(String(purchasePrice).replace(/[^0-9.]/g, ''))
    const parsedDate = new Date(purchaseDate)

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0 || Number.isNaN(parsedDate.getTime())) {
      return { error: 'Enter a valid purchase date and purchase price.' }
    }

    const year = parsedDate.getFullYear()
    const reference = averagePriceByYear[year]

    if (!reference) {
      return {
        error:
          'Instant estimates are currently available for purchase years from 1995 onwards. For older purchases, contact the team for a manual review.',
      }
    }

    const estimated1991Value = (parsedPrice / reference) * april1991Benchmark
    const likelyBand = getBandForValue(estimated1991Value)

    return {
      year,
      reference,
      estimated1991Value,
      likelyBand,
    }
  }, [purchaseDate, purchasePrice])

  return (
    <div className="min-h-screen bg-white text-[#0b0c0c]">
      <header className="bg-[#0b0c0c] text-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.svg" alt="Challenge My Band and Council Tax Challenge" className="h-14 w-auto" />
              <div>
                <p className="text-xl font-bold">Challenge My Band</p>
                <p className="text-sm text-[#b1b4b6]">Trading as Council Tax Challenge</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-5 text-sm font-bold">
              <a href="#how-it-works" className="hover:underline">How it works</a>
              <a href="#estimator" className="hover:underline">1991 estimator</a>
              <a href="#bands" className="hover:underline">Band table</a>
              <a href="#contact" className="hover:underline">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="border-b-8 border-[#ffdd00] bg-[#f3f2f1]">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm sm:px-6 lg:px-8">
          <strong className="mr-2">Important:</strong>
          This is an independent Council Tax band review service. It is not part of GOV.UK, the Valuation Office Agency or the Valuation Tribunal.
        </div>
      </div>

      <main>
        <section className="border-b border-[#b1b4b6] bg-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
            <div>
              <p className="mb-3 text-base font-bold text-[#00703c]">Council Tax band reviews based on April 1991 valuations</p>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[#0b0c0c] md:text-6xl">
                Challenge incorrect Council Tax bands using the right 1991 evidence.
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-[#0b0c0c]">
                The service is designed to test Valuation Office Agency banding decisions against the April 1991 valuation basis used for Council Tax in England.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#0b0c0c]">
                If the evidence supports it, the team prepares the case, manages correspondence and contests the underlying 1991 valuation on a no win, no fee basis.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="#contact">Request a free review</ButtonLink>
                <ButtonLink href="https://www.tax.service.gov.uk/check-council-tax-band/search" external secondary>
                  Check your current band
                </ButtonLink>
              </div>
            </div>

            <div className="border-4 border-[#1d70b8] bg-[#f8f8f8] p-6">
              <h2 className="text-2xl font-bold">At a glance</h2>
              <dl className="mt-6 space-y-5 text-base">
                <div>
                  <dt className="font-bold">How the service works</dt>
                  <dd className="mt-1">Historic evidence review, comparable analysis, written case preparation and challenge handling.</dd>
                </div>
                <div>
                  <dt className="font-bold">Fee basis</dt>
                  <dd className="mt-1">No win, no fee. If successful, the service fee is 30% of any refund or claim secured.</dd>
                </div>
                <div>
                  <dt className="font-bold">Valuation basis</dt>
                  <dd className="mt-1">England Council Tax bands are based on what a property would have sold for on 1 April 1991.</dd>
                </div>
                <div>
                  <dt className="font-bold">Screening tool</dt>
                  <dd className="mt-1">Use the 1991 estimator below to see whether the purchase history suggests a lower band may be arguable.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-[#b1b4b6] bg-[#f3f2f1]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <SectionHeading caption="How it works" title="A more formal, evidence-first approach to Council Tax band challenges.">
              The site has been designed in a more official public-information style so it feels clear, serious and process-led rather than promotional.
            </SectionHeading>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                ['1. Property review', 'The team reviews historic evidence, sale history and comparable banding.'],
                ['2. April 1991 assessment', 'The property is assessed against the 1 April 1991 valuation basis used for England Council Tax bands.'],
                ['3. Written case preparation', 'Where the evidence is strong enough, a written case is prepared and supporting material is organised.'],
                ['4. Challenge management', 'The team handles the challenge process and related correspondence on a no win, no fee basis.'],
              ].map(([title, text]) => (
                <div key={title} className="border border-[#b1b4b6] bg-white p-6">
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-lg leading-8">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="estimator" className="border-b border-[#b1b4b6] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <SectionHeading caption="1991 estimator" title="Estimate the likely April 1991 value of a property.">
              Enter the date the property was bought and the price paid. The tool uses a UK HPI-based benchmark to estimate what that figure may have looked like in April 1991.
            </SectionHeading>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
              <div className="border border-[#b1b4b6] bg-[#f8f8f8] p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="text-base font-bold">
                    Date bought
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(event) => setPurchaseDate(event.target.value)}
                      className="gov-input mt-2 w-full"
                    />
                  </label>
                  <label className="text-base font-bold">
                    Purchase price
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(event) => setPurchasePrice(event.target.value)}
                      placeholder="395000"
                      className="gov-input mt-2 w-full"
                    />
                  </label>
                </div>

                <div className="mt-6 border-l-[10px] border-[#1d70b8] bg-white p-5">
                  {!estimate && <p className="text-lg">Enter both fields to generate an estimate.</p>}
                  {estimate?.error && <p className="text-lg text-[#d4351c]">{estimate.error}</p>}
                  {estimate && !estimate.error && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-[0.06em] text-[#505a5f]">Estimated April 1991 value</p>
                        <p className="mt-2 text-4xl font-bold text-[#0b0c0c]">{formatCurrency(estimate.estimated1991Value)}</p>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="border border-[#b1b4b6] p-4">
                          <p className="text-sm font-bold uppercase tracking-[0.06em] text-[#505a5f]">Likely band range</p>
                          <p className="mt-2 text-2xl font-bold">Band {estimate.likelyBand.band}</p>
                          <p className="mt-1 text-base">{estimate.likelyBand.label}</p>
                        </div>
                        <div className="border border-[#b1b4b6] p-4">
                          <p className="text-sm font-bold uppercase tracking-[0.06em] text-[#505a5f]">Purchase year reference</p>
                          <p className="mt-2 text-2xl font-bold">{estimate.year}</p>
                          <p className="mt-1 text-base">Reference value used: {formatCurrency(estimate.reference)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-[#b1b4b6] bg-[#f8f8f8] p-6">
                <h3 className="text-2xl font-bold">How to use this estimate</h3>
                <ul className="mt-5 list-disc space-y-3 pl-6 text-lg leading-8">
                  <li>Use it as a quick screening tool, not as a final valuation opinion.</li>
                  <li>If the estimate falls close to a lower band threshold, the case may warrant a fuller review.</li>
                  <li>The strongest challenges usually combine this with historic evidence and local comparables.</li>
                  <li>The tool is intended for England banding, which uses 1 April 1991 values.</li>
                </ul>
              </div>
            </div>

            <div id="bands" className="mt-12">
              <h3 className="text-2xl font-bold">Council Tax bands in England based on 1 April 1991 values</h3>
              <div className="mt-5 overflow-x-auto border border-[#b1b4b6]">
                <table className="min-w-full border-collapse text-left text-base">
                  <thead className="bg-[#f3f2f1]">
                    <tr>
                      <th className="border-b border-[#b1b4b6] px-4 py-3 font-bold">Band</th>
                      <th className="border-b border-[#b1b4b6] px-4 py-3 font-bold">Value at 1 April 1991</th>
                    </tr>
                  </thead>
                  <tbody>
                    {englandBands.map((band) => (
                      <tr key={band.band} className="odd:bg-white even:bg-[#f8f8f8]">
                        <td className="border-b border-[#d8d8d8] px-4 py-3 font-bold">{band.band}</td>
                        <td className="border-b border-[#d8d8d8] px-4 py-3">{band.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <SectionHeading caption="Contact" title="Request a free review of the current band and the 1991 evidence.">
              If the current band looks wrong, the team can review the property, prepare the case and advise whether a challenge should proceed.
            </SectionHeading>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <form className="border border-[#b1b4b6] bg-[#f8f8f8] p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="text-base font-bold">
                    Full name
                    <input className="gov-input mt-2 w-full" placeholder="Jane Smith" />
                  </label>
                  <label className="text-base font-bold">
                    Email address
                    <input className="gov-input mt-2 w-full" placeholder="jane@email.com" />
                  </label>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="text-base font-bold">
                    Phone number
                    <input className="gov-input mt-2 w-full" placeholder="07..." />
                  </label>
                  <label className="text-base font-bold">
                    Current band
                    <select className="gov-input mt-2 w-full bg-white">
                      <option>Select band</option>
                      {englandBands.map((band) => (
                        <option key={band.band}>{band.band}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="mt-5 block text-base font-bold">
                  Property address
                  <input className="gov-input mt-2 w-full" placeholder="House number, street, town, postcode" />
                </label>
                <label className="mt-5 block text-base font-bold">
                  Why does the band appear wrong?
                  <textarea
                    className="gov-input mt-2 min-h-[140px] w-full"
                    placeholder="For example: similar homes are in a lower band, the 1991 estimate appears lower, or there is historic evidence that the current band is too high."
                  />
                </label>
                <button type="button" className="mt-6 inline-flex items-center gap-2 bg-[#1d70b8] px-5 py-3 font-bold text-white hover:bg-[#003078]">
                  Submit review request
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="space-y-5">
                <div className="border-l-[10px] border-[#ffdd00] bg-[#f3f2f1] p-5">
                  <h3 className="text-xl font-bold">No win, no fee</h3>
                  <p className="mt-2 text-lg leading-8">If the case succeeds, the service fee is 30% of any refund or claim secured. If it does not succeed, there is no fee.</p>
                </div>
                <div className="border border-[#b1b4b6] p-5">
                  <h3 className="text-xl font-bold">Independent service</h3>
                  <p className="mt-2 text-lg leading-8">The website is intentionally styled to feel clear and official, but it also makes clear that the service is independent and is not a government website.</p>
                </div>
                <div className="border border-[#b1b4b6] p-5">
                  <h3 className="text-xl font-bold">Useful link</h3>
                  <p className="mt-2 text-lg leading-8">Homeowners can use the official checker to confirm their current band before requesting a review.</p>
                  <div className="mt-4">
                    <ButtonLink href="https://www.tax.service.gov.uk/check-council-tax-band/search" external secondary>
                      Open official band checker
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
