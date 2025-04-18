﻿using Importer.Model;
using Importer.Report;

namespace Importer.Fixer
{
    internal class FixRemoveEmptyName<T> : IItemsFixer<T> where T : Item
    {
        public Task FixItemsAsync(List<T> items, IMessageReporter reporter)
        {
            foreach (var item in items.ToList())
            {
                if (string.IsNullOrEmpty(item.Name))
                    items.Remove(item);
            }

            return Task.CompletedTask;
        }
    }
}
