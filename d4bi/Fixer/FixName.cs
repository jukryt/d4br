﻿using Importer.Model;
using Importer.Report;

namespace Importer.Fixer
{
    internal class FixName<T> : IItemsFixer<T> where T : Item
    {
        public Task FixItemsAsync(List<T> items, IMessageReporter reporter)
        {
            foreach (var item in items)
            {
                item.Name = item.Name
                    ?.Replace('\u00A0', ' ') // non-breaking space
                    ?.Replace('\u2014', '-') // Em Dash
                    ?.Replace("  ", " ")     // double space
                    ?.Trim();
            }

            return Task.CompletedTask;
        }
    }
}
