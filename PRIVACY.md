# Turn privacy notice

Turn's privacy notice is also available in the app without a network connection.

Contents:

1.  [What stays on this iPhone](#what-stays-on-this-iphone)
1.  [What leaves in Listen mode](#what-leaves-in-listen-mode)
1.  [Service records](#service-records)
1.  [Purchases](#purchases)
1.  [Age and people nearby](#age-and-people-nearby)
1.  [Questions](#questions)

## What stays on this iPhone

Your phrase bank, places, tap counts, and settings stay on this iPhone until you erase them. Audio is never recorded, stored, or sent. A partner’s transcript is held in memory as a caption for at most two minutes, then forgotten. Turn keeps no transcript history.

## What leaves in Listen mode

After you and your partner agree, Turn transcribes their speech on the iPhone. For each partner line, Turn sends the text, the current place name, category names, and up to 40 candidate phrases through a relay on Cloudflare to a third-party AI service in the United States. Recognized names are replaced with tags before sending. Turn does not send your whole phrase bank. A line or phrase can still reveal health details, such as a clinic visit or pain.

## Service records

The relay keeps a hashed app ID and free-line count. To limit abuse, it also keeps a salted hash of the network address used for each request and a request count. The count resets each minute; the relay record can remain until the relay is deleted. Cloudflare request logs are kept for up to three days. The AI service may keep submitted text to make the service work, produce telemetry, monitor fraud or abuse, and meet legal duties. The submitted text is not used to train the decision model. Turn does not keep audio recordings or transcripts.

## Purchases

RevenueCat receives an app user ID and purchase information to provide and restore Turn Listen. The relay receives the app ID and stores a hash of it to track free lines and access. RevenueCat keeps purchase records under its own policy.

## Age and people nearby

Turn is for adults. Do not use Listen mode with a partner under 18. Pause listening when other people are talking nearby.

## Questions

For questions about Turn’s data, contact the team through the public Issues page. Do not include personal or health details in a public issue.

[Turn Issues page](https://github.com/M1KUAPP/Turn/issues)
