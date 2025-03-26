﻿using Importer.Fixer;
using Importer.Logger;
using Importer.Model;

namespace Importer.Custom.Skill
{
    internal class SkillFilter : IItemsFixer<ClassItem>
    {
        private static readonly HashSet<long> IgnoreItems = new()
        {
            1858262, 1859218,
        };

        public Task FixItemsAsync(List<ClassItem> items, ILogger logger)
        {
            RemoveIgnoreItems(items, logger);

            return Task.CompletedTask;
        }

        private void RemoveIgnoreItems(List<ClassItem> items, ILogger logger)
        {
            var ignoreItems = new HashSet<long>();

            foreach (var item in items.ToList())
            {
                if (IgnoreItems.Contains(item.Id))
                {
                    items.Remove(item);
                    ignoreItems.Add(item.Id);
                }
            }

            if (IgnoreItems.Count != ignoreItems.Count)
            {
                var exceptItems = IgnoreItems.Except(ignoreItems);
                var exceptItemsString = string.Join(", ", exceptItems);
                logger.WriteMessage($"{nameof(RemoveIgnoreItems)} not match ({exceptItemsString})", nameof(SkillFilter));
            }
        }
    }
}
