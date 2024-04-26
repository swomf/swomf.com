---
title: "Logarithm and exponent properties"
description: "Basic algebraic intuitions for basic exponent and logarithm properties"
tags:
  - math
pubDate: "Apr 21 2024"
heroImage: "/blog-pictures/logarithm-and-exponent-properties.jpg"
---

## Exponent rules

The exponent rules appear when you visualize
what's being multiplied, then slap basic algebra on.
With these two rules:

$$
\begin{align}
x^ax^b &= x^{a+b}  \\
  &= (x * x *... \text{a times}) \times (x * x *... \text{b times}) \notag \\
  &= (x * \text{itself, } a+b \text{ times}) \notag
\notag \\
(x^a)^b &= x^{ab} \\
 &= (x* \text{itself, a times}) \times \text{itself, b times} \notag \\
 &= (x * \text{itself, } a \times b \text{ times}) \notag
\end{align}
$$

We can quickly infer rooting, and then $\frac{power}{root}$:

$$
\begin{align}
\sqrt[b]{x} &= x^{1/b}
\quad \text{\ From rule 2, since} \\
(\sqrt[b]{x})^b &= (x^{1/b})^b = x^{(b/b)} \notag \\
\notag \\
x^{a/b} &= \sqrt[b]{x^a} \quad  \text{\ From rule 3, since } \\
x^{a/b} &= (x^a)^{1/b} = \sqrt[b]{x^a} \notag \\
\end{align}
$$

With rule 1, we can also infer that:

$$
\begin{align}
x^0 &= x^1 \div x^1 = 1 \quad \text{From rule 1} \\
\notag \\
x^{-a} &= x^0 \div x^a = \frac{1}{x^a} \quad \text{From rule 1 and 5} \\
\notag \\
a^xb^x &= (ab)^x \\
  &= (a * a * ... \text{x times}) \times (b * b * ...\text{x times}) \notag \\
  &= (ab * ab * ... \text{x times by associative property})\notag
\end{align}
$$

## The cooler logarithm rules

The logarithm is the exponent needed to get a base
to a number, i.e.  
$b^x=n \iff \log_b{n}=x$

By definition, $\log_b(b^x)=x$ since the exponent
needed to get any $b$ to $b^{x}$ is... well, $x$.

### Addition rule

$$
\begin{align}
\log_b(mn) &= \log_bm + \log_bn \\
\text{Let } m = b^x \text{ and } n &= b^y \text{ so we can substitute:} \notag \\
\log_b(b^xb^y) &= \log_b(b^x) + \log_b(b^y) \notag \\
\log_b(b^{x + y}) &= \log_b(b^x) + \log_b(b^y) \notag \\
x + y &= x + y \quad \text{ by definition} \notag
\end{align}
$$

### Subtraction rule

This is just the extension of above, but with
the use of $n=b^y$ becoming $n^{-1}=b^{-y}$.

$$
\begin{align}
\log_b(\frac{m}{n}) &= log_bm - log_bn \\
\log_b(mn^{-1}) &= log_bm - log_bn \notag \\
\log_b(b^x(b^y)^{-1}) &= \log_b(b^x) + log_b((b^y)^{-1}) \notag \\
\log_b(b^xb^{-y}) &= \log_b(b^x) + log_b(b^{-y}) \notag \\
\log_b(b^{x-y}) &= \log_b(b^x) + log_b(b^{-y}) \notag \\
x - y &= x + - y \notag
\end{align}
$$

### Power rule

$$
\begin{align}
\log_b(\sqrt[q]{m^p}) &= \frac{p}{q} \log_bm \\
\log_b(m^{\frac{p}{q}}) &= \frac{p}{q} \log_bm \notag \\
\log_b((b^x)^{\frac{p}{q}}) &= \frac{p}{q} \log_b(b^x) \notag \\
\log_b(b^{\frac{xp}{q}}) &= \frac{p}{q} \log_b(b^x) \notag \\
x \times \frac{p}{q} &= x \times \frac{p}{q} \notag
\end{align}
$$

Of course, we only use the principal
solution of the root, since a logarithm
cannot take a negative argument (its domain
is $x>0$).

### Base change rule

Any given logarithm can be written in another
arbitrary-base logarithm.

$$
\begin{align}
\log_bm &= \frac{\log_nm}{\log_nb} \\
\log_b(b^x) &= \frac{\log_n(b^x)}{\log_nb} \notag \\
\log_b(b^x) &= \frac{x\log_nb}{log_nb} \quad \text{ By the power rule} \notag \\
x &= x \notag
\end{align}
$$
