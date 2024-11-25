import { useState } from "react";

interface MarketDataRow {
  year: number;
  snp500_growth_with_dividends: number;
  t10bond: number;
  gold: number;
  inflation: number;
}

interface DataProps {
  marketData: MarketDataRow[];
}

function getExtremeReturns(
  marketData: MarketDataRow[],
  holdForYears: number,
  includeInflation: boolean
) {
  // pairs are (year, percent)
  const bestSnp = [0, -Infinity];
  const bestT10 = [0, -Infinity];
  const bestGold = [0, -Infinity];
  const worstSnp = [0, Infinity];
  const worstT10 = [0, Infinity];
  const worstGold = [0, Infinity];
  const compareCurrentWorstBest = (
    cur: number[],
    worst: number[],
    best: number[]
  ) => {
    if (cur[1] < worst[1]) {
      worst[0] = cur[0]; // year
      worst[1] = parseFloat(cur[1].toFixed(2)); // percent
    }
    if (cur[1] > best[1]) {
      best[0] = cur[0]; // year
      best[1] = parseFloat(cur[1].toFixed(2)); // percent
    }
  };

  /**
   * Calculate geometric mean of list of percentages
   * @param percents list of percents
   * @returns geometric mean as percent (takes compounding into account)
   */
  const geometricMeanPercents = (percents: number[]) =>
    (Math.pow(
      percents.map(percent => percent / 100 + 1).reduce((a, b) => a * b, 1),
      1 / percents.length
    ) -
      1) *
    100;
  for (let i = 0; i < marketData.length - holdForYears; i++) {
    const period = marketData.slice(i, i + holdForYears);

    const currentYear = period[0].year;

    // fisher equation approximated to r = i - π
    const currentSnpDecimal = geometricMeanPercents(
      period.map(
        row =>
          row.snp500_growth_with_dividends -
          row.inflation * (includeInflation ? 1 : 0)
      )
    );
    const currentT10Decimal = geometricMeanPercents(
      period.map(
        row => row.t10bond - row.inflation * (includeInflation ? 1 : 0)
      )
    );
    const currentGoldDecimal = geometricMeanPercents(
      period.map(row => row.gold - row.inflation * (includeInflation ? 1 : 0))
    );

    compareCurrentWorstBest(
      [currentYear, currentSnpDecimal],
      worstSnp,
      bestSnp
    );

    compareCurrentWorstBest(
      [currentYear, currentT10Decimal],
      worstT10,
      bestT10
    );

    compareCurrentWorstBest(
      [currentYear, currentGoldDecimal],
      worstGold,
      bestGold
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Asset</th>
          <th>Best growth/yr </th>
          <th>Worst growth/yr</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>S&P 500</td>
          <td>
            {bestSnp[1]}% <br /> {bestSnp[0]} to {bestSnp[0] + holdForYears}
          </td>
          <td>
            {worstSnp[1]}% <br /> {worstSnp[0]} to {worstSnp[0] + holdForYears}
          </td>
        </tr>
        <tr>
          <td>10 Year Treasury Bond</td>
          <td>
            {bestT10[1]}% <br /> {bestT10[0]} to {bestT10[0] + holdForYears}
          </td>
          <td>
            {worstT10[1]}% <br /> {worstT10[0]} to {worstT10[0] + holdForYears}
          </td>
        </tr>
        <tr>
          <td>Gold</td>
          <td>
            {bestGold[1]}% <br /> {bestGold[0]} to {bestGold[0] + holdForYears}
          </td>
          <td>
            {worstGold[1]}% <br /> {worstGold[0]} to{" "}
            {worstGold[0] + holdForYears}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function MatchTheMarketIsland({ marketData }: DataProps) {
  const [holdYear, setHoldYear] = useState(1);
  const [includeInflation, setIncludeInflation] = useState(false);

  return (
    <div>
      <div className="grid gap-4 *:mx-2">
        <p className="my-0">Years to hold the bag for: {holdYear}</p>
        <input
          type="range"
          min={1}
          max={marketData[marketData.length - 1].year - marketData[0].year}
          value={holdYear}
          onChange={e => setHoldYear(parseInt(e.target.value))}
          className="max-w-[50%]"
        />
        <label>
          <input
            type="checkbox"
            checked={includeInflation}
            onChange={e => setIncludeInflation(e.target.checked)}
            className="mr-2"
          />
          {/* @ts-ignore https://github.com/microsoft/TypeScript/issues/4648 */}
          <tooltip>
            Adjust for inflation?
            {/* @ts-ignore */}
            <tip-after>
              Loosely, inflation worsens interest earnings but eases debt.
              Example:
              <br className="mb-2" />
              Nominal growth: 3% <br />
              Inflation rate: 5% <br />
              Real growth: 3-5= <span className="!text-red-300">-2%</span>
              <br className="mb-2" />
              Yup, you lose money. BUT if you had $100 in debt, its "value"
              would be worth "less" to the one you're indebted to.{" "}
              <br className="mb-2" />
              Paying n% of debt a month, minus the x% growing inflation, works
              out in your favor by reducing collectors' profits.
              {/* @ts-ignore */}
            </tip-after>
            {/* @ts-ignore */}
          </tooltip>
        </label>
      </div>
      <p>
        Best returns:
        {getExtremeReturns(marketData, holdYear, includeInflation)}
      </p>
    </div>
  );
}

export default MatchTheMarketIsland;
