import { GuildMember, Message, TextChannel } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import localize from '~/util/i18n/localize';
import { existsSound } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class SoundCommand extends QueueCommand {
  public readonly triggers = [];

  public run(message: Message) {
    if (message.webhookId) {
      message.client.fetchWebhook(message.webhookId).then(hook => {
        const hookName = hook.name;
        const user = (message.channel as TextChannel).members.get(hookName);
        this.runSound(message, user);
      });
      return;
    }
    if (!message.member) return;
    this.runSound(message, message.member);
  }

  private runSound(message: Message, user: GuildMember | undefined) {
    if (!user) return;

    const sound = message.content;
    if (!existsSound(sound)) return;

    const { channel: voiceChannel } = user.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
