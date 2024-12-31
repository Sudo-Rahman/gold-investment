<script lang="ts">
    import Check from "lucide-svelte/icons/check";
    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
    import {tick} from "svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import {Button} from "$lib/components/ui/button/index.js";
    import {cn} from "$lib/utils.js";
    import type {CurrenciesFlagType} from "$lib/model/currenciesFlag";

    let {currencies, value = $bindable()}: { currencies: CurrenciesFlagType[], value : CurrenciesFlagType} = $props();

    let open = $state(false);
    let _code = $state("USD");
    let triggerRef = $state<HTMLButtonElement>(null!);

    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger() {
        open = false;
        tick().then(() => {
            triggerRef.focus();
        });
    }
</script>

<Popover.Root bind:open>
    <Popover.Trigger bind:ref={triggerRef}>
        {#snippet child({props})}
            <Button
                    variant="outline"
                    class="flex px-2 border-none"
                    {...props}
                    role="combobox"
                    aria-expanded={open}>
                <div class="flex w-full justify-between overflow-hidden">
                    <span class="truncate w-[90%] text-lg">
                        {#if value}
                            {value.flag} {value.code} - {value.name}
                        {/if}
                    </span>
                    <ChevronsUpDown class="ml-2 flex w-10 size-4 shrink-0 opacity-50"/>
                </div>
            </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-full p-0">
        <Command.Root>
            <Command.Input placeholder="Search currencies..." class="p-2"/>
            <Command.List>
                <Command.Empty>
                    No currencies found
                </Command.Empty>
                <Command.Group>
                    {#each currencies as currency (currency.code)}
                        <Command.Item
                                value={currency.name}
                                onSelect={() => {_code = currency.code;value = currency;closeAndFocusTrigger();}}>
                            <Check class={cn("mr-2 size-4",_code !== currency.code && "text-transparent")}/>
                            {currency.name}
                        </Command.Item>
                    {/each}
                </Command.Group>
            </Command.List>
        </Command.Root>
    </Popover.Content>
</Popover.Root>