namespace Importer.Extension
{
    internal static class EnumerableExtension
    {
        public static IEnumerable<T> ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            ArgumentNullException.ThrowIfNull(source);
            ArgumentNullException.ThrowIfNull(action);

            foreach (var item in source)
                yield return ForEachAction(item, action);
        }

        private static T ForEachAction<T>(T item, Action<T> action)
        {
            action(item);
            return item;
        }
    }
}
