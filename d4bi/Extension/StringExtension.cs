namespace Importer.Extension
{
    internal static class StringExtension
    {
        public static string AddLeft(this string str, int width, char marginChar = ' ')
        {
            return str.PadLeft(str.Length + width, marginChar);
        }

        public static bool EndsWith(this string? str, params char[] values)
        {
            if (string.IsNullOrEmpty(str))
                return false;

            var lastChar = str[str.Length - 1];
            foreach (var value in values)
            {
                if (lastChar == value)
                    return true;
            }

            return false;
        }

        public static IEnumerable<string> GetLines(this string? str)
        {
            if (string.IsNullOrEmpty(str))
                yield break;

            using (var reader = new StringReader(str))
            {
                while (true)
                {
                    var line = reader.ReadLine();

                    if (line == null)
                        break;

                    if (!string.IsNullOrWhiteSpace(line))
                        yield return line;
                }
            }
        }

        public static string Linearize(this IEnumerable<string> lines, bool isEndDot = true)
        {
            var messages = lines
                .Select(l =>
                {
                    var message = l?.TrimStart(' ').TrimEnd(' ');
                    if (string.IsNullOrEmpty(message))
                        return null;

                    return !message.EndsWith('.', ',', ':', ';')
                        ? message + "."
                        : message;
                })
                .Where(m => !string.IsNullOrEmpty(m));

            var result = string.Join(' ', messages);

            if (string.IsNullOrEmpty(result))
                return string.Empty;

            if (!isEndDot)
                result = result.TrimEnd('.', ',', ':', ';');

            return result;
        }

        public static string Linearize(this string? str, bool isEndDot = true)
        {
            return str.GetLines().Linearize(isEndDot);
        }
    }
}
