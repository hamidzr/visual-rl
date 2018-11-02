import matplotlib.pyplot as plt
import numpy as np
import time

TRIAL=str(int(time.time()))


def remove_outliers(arr, m=2):
  u = np.mean(arr)
  s = np.std(arr)
  filtered = [e for e in arr if (u - 2 * s < e < u + 2 * s)]
  return filtered

def moving_avg(arr, window=10):
  cumsum_vec = np.cumsum(np.insert(arr, 0, 0))
  ma_vec = (cumsum_vec[window:] - cumsum_vec[:-window]) / window
  return ma_vec

def plot_linear(xs, ys, fname=None, label=None, offset=0,
                xlabel=None, ylabel=None, title=None, color='b'):
  xs = xs[offset:]
  ys = ys[offset:]
  assert (len(xs) == len(ys)), f'length mismatch between axises, {len(xs)} vs {len(ys)}'
  if xlabel: plt.xlabel(xlabel)
  if ylabel: plt.ylabel(ylabel)
  if title: plt.title(title)
  plt.plot(xs, ys, label=label, c=color)
  if label: plt.legend()
  if (fname):
    plt.savefig(f'figs/{fname}.png')
    plt.close()
  return plt

def plot_linear_ys(ys, **kwargs):
  # plots a list of y values generating sequential xs
  xs = range(len(ys))
  return plot_linear(xs, ys, **kwargs)
