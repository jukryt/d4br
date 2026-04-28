using Importer.Report;

namespace Importer.Custom.Temper.Ru
{
    internal class TemperRuReader : TemperReader
    {
        public TemperRuReader(TemperSource source, ProgressReporter progressReporter) : base(source, progressReporter)
        {
        }

        protected override TemperType GetTemperType(string? description)
        {
            if (string.IsNullOrEmpty(description))
                return TemperType.None;

            if (description.Equals("Свойства можно применять к оружию.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Weapon;

            if (description.Equals("Свойства можно применять к оружию, перчаткам, кольцам и амулетам.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Offensive;

            if (description.Equals("Свойства можно применять к шлемам, нагрудникам, штанам, щитам и амулетам.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Defensive;

            if (description.Equals("Свойства можно применять к шлемам, нагрудникам, перчаткам, штанам, сапогам, щитам и амулетам.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Utility;

            if (description.Equals("Свойства можно применять к сапогам и амулетам.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Mobility;

            if (description.Equals("Свойства можно применять к кольцам и амулетам.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Resource;

            return TemperType.None;
        }
    }
}
